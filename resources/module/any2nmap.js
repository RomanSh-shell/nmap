'use strict';

window.addEventListener('load', () => {

    // --- DOM Элементы ---
    const loginBtn = document.getElementById('login-yandex');
    const authBlock = document.getElementById('auth-block');
    const appDiv = document.getElementById('app');
    const statusDiv = document.getElementById('status');
    const fileInput = document.getElementById('file-input');
    const folderNameInput = document.getElementById('folder-name');
    const convertDownloadBtn = document.getElementById('convert-download');
    const convertUploadBtn = document.getElementById('convert-upload');
    const manualInstructionsDiv = document.getElementById('manual-upload-instructions');
    const yandexPathDiv = document.getElementById('yandex-path');
    const copyPathBtn = document.getElementById('copy-path-btn');

    folderNameInput.placeholder = chrome.i18n.getMessage('folderNamePlaceholder');

    // =================================================================
    // --- АВТОРИЗАЦИЯ ---
    // =================================================================

    const CLIENT_ID = '81c6e7a2503a445696518a3c631a319f';
    const REDIRECT_URL = chrome.identity.getRedirectURL();
    const AUTH_URL = `https://oauth.yandex.ru/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URL)}&scope=cloud_api:disk.write`;

    function launchAuthFlow(interactive, callback) {
        chrome.identity.launchWebAuthFlow({
            url: AUTH_URL,
            interactive: interactive
        }, (redirect_url) => {
            if (chrome.runtime.lastError || !redirect_url) {
                const errorMessage = chrome.i18n.getMessage('statusAuthFailure') + (chrome.runtime.lastError ? ` ${chrome.runtime.lastError.message}` : '');
                statusDiv.textContent = errorMessage;
                authBlock.style.display = 'block';
                if (callback) callback(false);
                return;
            }

            const url = new URL(redirect_url);
            const params = new URLSearchParams(url.hash.substring(1));
            const accessToken = params.get('access_token');

            if (accessToken) {
                chrome.storage.local.set({ yandex_token: accessToken }, () => {
                    authBlock.style.display = 'none';
                    statusDiv.textContent = chrome.i18n.getMessage('statusAuthSuccess');
                    if (callback) callback(true);
                });
            } else {
                 statusDiv.textContent = chrome.i18n.getMessage('statusAuthFailure');
                 authBlock.style.display = 'block';
                 if (callback) callback(false);
            }
        });
    }

    chrome.storage.local.get('yandex_token', (data) => {
        if (data.yandex_token) {
            authBlock.style.display = 'none';
            statusDiv.textContent = chrome.i18n.getMessage('statusAuthSuccess');
        } else {
            authBlock.style.display = 'block';
        }
    });

    loginBtn.addEventListener('click', () => launchAuthFlow(true));

    // =================================================================
    // --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
    // =================================================================

    const uuidv4 = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    const middle_point = (path) => {
        if (path.length > 2) return path[Math.floor((path.length - 1) / 2)];
        if (path.length === 2) return [(path[0][0] + path[1][0]) / 2, (path[0][1] + path[1][1]) / 2];
        return path[0];
    };

    // =================================================================
    // --- ЛОГИКА ПАРСИНГА И ФОРМИРОВАНИЯ JSON ---
    // =================================================================

    function geojson_to_yndxjson(geojson) {
        const points = {}, paths = {};

        geojson.features.forEach(feature => {
            const geom = feature.geometry;
            if (!geom) return;

            if (geom.type === 'Point') {
                points[uuidv4()] = { coords: geom.coordinates, desc: '' };
            } else if (geom.type === 'LineString') {
                paths[uuidv4()] = geom.coordinates;
            } else if (geom.type === 'Polygon') {
                // Берем только внешний контур
                paths[uuidv4()] = geom.coordinates[0];
            }
        });

        return { points, paths };
    }

    function osm_parse(osmXmlText) {
        const parser = new DOMParser();
        const osmXml = parser.parseFromString(osmXmlText, "text/xml");
        const geojson = osmtogeojson(osmXml);
        return geojson_to_yndxjson(geojson);
    }

    function gpx_parse(gpxText) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(gpxText, "text/xml");
        const points = {}, paths = {};

        const processPoints = (elements, nameSelector, descSelector, cmtSelector) => {
             elements.forEach(el => {
                const lon = parseFloat(el.getAttribute('lon'));
                const lat = parseFloat(el.getAttribute('lat'));
                const name = el.querySelector(nameSelector)?.textContent || '';
                const desc = el.querySelector(descSelector)?.textContent || '';
                const cmt = el.querySelector(cmtSelector)?.textContent || '';
                points[uuidv4()] = {
                    coords: [lon, lat],
                    desc: [name, cmt, desc].filter(Boolean).join('\n')
                };
            });
        };

        xmlDoc.querySelectorAll('trk').forEach(track => {
            const coords = Array.from(track.querySelectorAll('trkpt')).map(pt => [parseFloat(pt.getAttribute('lon')), parseFloat(pt.getAttribute('lat'))]);
            if (coords.length > 0) {
                paths[uuidv4()] = coords;
                const name = track.querySelector('name')?.textContent;
                if (name) {
                    const mid_pt = middle_point(coords);
                    points[uuidv4()] = { coords: mid_pt, desc: name };
                }
            }
        });

        xmlDoc.querySelectorAll('rte').forEach(route => {
             const coords = Array.from(route.querySelectorAll('rtept')).map(pt => [parseFloat(pt.getAttribute('lon')), parseFloat(pt.getAttribute('lat'))]);
             if (coords.length > 0) {
                paths[uuidv4()] = coords;
                const name = route.querySelector('name')?.textContent;
                if (name) {
                    const mid_pt = middle_point(coords);
                    points[uuidv4()] = { coords: mid_pt, desc: name };
                }
            }
        });

        processPoints(xmlDoc.querySelectorAll('wpt'), 'name', 'desc', 'cmt');

        return { points, paths };
    }

    function kml_parse(kmlText) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(kmlText, "text/xml");
        const points = {}, paths = {};

        xmlDoc.querySelectorAll('Placemark').forEach(pm => {
            const name = pm.querySelector('name')?.textContent.trim() || '';
            const description = (pm.querySelector('description')?.textContent || '').trim().replace(/<.*?>/g, '');

            const line = pm.querySelector('LineString > coordinates');
            if (line) {
                const coords = line.textContent.trim().split(/\s+/).map(cs => cs.split(',').map(Number));
                paths[uuidv4()] = coords;
                if (name) points[uuidv4()] = { coords: middle_point(coords), desc: name };
            }

            const pointNode = pm.querySelector('Point > coordinates');
            if (pointNode) {
                const coords = pointNode.textContent.trim().split(',').map(Number);
                points[uuidv4()] = { coords, desc: [name, description].filter(Boolean).join('\n') };
            }
        });
        return { points, paths };
    }

    async function kmz_parse(file) {
        const zip = await new JSZip().loadAsync(file);
        const kmlFile = zip.file(/(\.kml)$/i)[0];
        if (!kmlFile) throw new Error(chrome.i18n.getMessage('errorNoKmlInKmz'));
        return kml_parse(await kmlFile.async('string'));
    }

    function csv_parse(csvText) {
        const points = {}, paths = {};
        const lines = csvText.split(/\r?\n/).filter(line => line.trim());
        const headerLine = lines[0].toLowerCase();
        const hasHeader = headerLine.includes('lat') || headerLine.includes('lon');
        const data = hasHeader ? lines.slice(1) : lines;
        let latIdx = -1, lonIdx = -1;
        if (hasHeader) {
            const headers = lines[0].split(',').map(h => h.toLowerCase().trim());
            latIdx = headers.findIndex(h => h.includes('lat'));
            lonIdx = headers.findIndex(h => h.includes('lon'));
        } else {
            const firstRow = data[0].split(',');
            for (let i = 0; i < firstRow.length; i++) {
                if (!isNaN(parseFloat(firstRow[i]))) {
                    if (latIdx === -1) latIdx = i;
                    else if (lonIdx === -1) { lonIdx = i; break; }
                }
            }
        }
        if (latIdx === -1 || lonIdx === -1) throw new Error(chrome.i18n.getMessage('errorCsvColumns'));

        data.forEach(line => {
            const values = line.split(',');
            const lat = parseFloat(values[latIdx]);
            const lon = parseFloat(values[lonIdx]);
            if (!isNaN(lat) && !isNaN(lon)) {
                const desc = values.filter((_, i) => i !== latIdx && i !== lonIdx).join(', ');
                points[uuidv4()] = { coords: [lon, lat], desc: desc };
            }
        });
        return { points, paths };
    }

    // =================================================================
    // --- ИНТЕГРАЦИЯ С ЯНДЕКС ДИСКОМ ---
    // =================================================================

    function downloadFile(data, filename) {
        const jsonString = JSON.stringify(data);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function showManualUploadInstructions(folderName) {
        const yandexPath = `/Приложения/Блокнот картографа Народной карты/${folderName}`;
        yandexPathDiv.textContent = yandexPath;
        manualInstructionsDiv.style.display = 'block';
    }

    copyPathBtn.addEventListener('click', () => {
        const pathText = yandexPathDiv.textContent;
        navigator.clipboard.writeText(pathText).then(() => {
            copyPathBtn.textContent = chrome.i18n.getMessage('copiedButton') || 'Скопировано!';
            setTimeout(() => {
                copyPathBtn.textContent = chrome.i18n.getMessage('copyButton');
            }, 2000);
        });
    });

    async function uploadToYandexDisk(folderName, data, yandexToken) {
        const path = `/Приложения/Блокнот картографа Народной карты/${folderName}`;
        const apiUrl = 'https://cloud-api.yandex.net/v1/disk/resources';
        const headers = { 'Authorization': `OAuth ${yandexToken}` };

        statusDiv.textContent = chrome.i18n.getMessage('statusCreatingFolder');
        await fetch(`${apiUrl}?path=${encodeURIComponent(path)}`, { method: 'PUT', headers });

        statusDiv.textContent = chrome.i18n.getMessage('statusGettingUrl');
        const uploadUrlRes = await fetch(`${apiUrl}/upload?path=${encodeURIComponent(path + '/index.json')}&overwrite=true`, { headers });
        if (!uploadUrlRes.ok) throw new Error(chrome.i18n.getMessage('errorGetUploadUrl'));
        const { href } = await uploadUrlRes.json();

        statusDiv.textContent = chrome.i18n.getMessage('statusUploading');
        const uploadRes = await fetch(href, {
            method: 'PUT',
            body: new Blob([JSON.stringify(data)], {type: 'application/json'})
        });
        if (!uploadRes.ok) throw new Error(chrome.i18n.getMessage('errorFileUpload'));

        statusDiv.textContent = chrome.i18n.getMessage('statusSuccess');
    }

    // =================================================================
    // --- ГЛАВНАЯ ЛОГИКА ---
    // =================================================================

    async function convertFile(isUploadMode) {
        const file = fileInput.files[0];
        const folderName = folderNameInput.value.trim();

        if (!file || !folderName) {
            alert(chrome.i18n.getMessage('alertMissingInput'));
            return;
        }

        convertDownloadBtn.disabled = true;
        convertUploadBtn.disabled = true;
        statusDiv.textContent = chrome.i18n.getMessage('statusProcessing');
        manualInstructionsDiv.style.display = 'none';

        try {
            const ext = file.name.split('.').pop().toLowerCase();
            let resultData;

            const text = await file.text();
            switch (ext) {
                case 'gpx':
                    resultData = gpx_parse(text);
                    break;
                case 'kml':
                    resultData = kml_parse(text);
                    break;
                case 'csv':
                    resultData = csv_parse(text);
                    break;
                case 'osm':
                    resultData = osm_parse(text);
                    break;
                case 'kmz':
                    resultData = await kmz_parse(await file.arrayBuffer());
                    break;
                default:
                    throw new Error(chrome.i18n.getMessage('errorUnsupportedFile'));
            }

            if (isUploadMode) {
                chrome.storage.local.get('yandex_token', async (data) => {
                    if (data.yandex_token) {
                        await uploadToYandexDisk(folderName, resultData, data.yandex_token);
                    } else {
                        statusDiv.textContent = chrome.i18n.getMessage('statusAuthFailure');
                    }
                });
            } else {
                const filename = `${folderName}/index.json`;
                downloadFile(resultData, 'index.json');
                statusDiv.textContent = chrome.i18n.getMessage('statusDownloadSuccess');
                showManualUploadInstructions(folderName);
            }
        } catch (error) {
            statusDiv.textContent = `${chrome.i18n.getMessage('errorGeneric')} ${error.message}`;
            console.error(error);
        } finally {
            convertDownloadBtn.disabled = false;
            convertUploadBtn.disabled = false;
        }
    }

    convertDownloadBtn.addEventListener('click', () => convertFile(false));

    convertUploadBtn.addEventListener('click', () => {
        chrome.storage.local.get('yandex_token', (data) => {
            if (data.yandex_token) {
                convertFile(true);
            } else {
                launchAuthFlow(true, (success) => {
                    if (success) {
                        convertFile(true);
                    }
                });
            }
        });
    });
});
