'use strict';

/**
 * Добавляет возможность перехода на другие карты
 */

(function () {
  const popupShow = window.appChrome.popupShow;
  const services = {
    "nspd-gov": {
      "title": "Геоинформационный портал",
      "icon": '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 68 68"><path fill="url(#a)" d="M32 2h2l2.2.2a30.4 30.4 0 0 1 14.5 5.5c1.3 1 2.6 1.9 3.7 3H32l-3 .3c-1.6.2-3.1.8-4.6 1.5-1.9.9-3.8 1.8-5.4 3.2a29 29 0 0 0-4.1 4.4c-1 1.4-1.8 3-2.5 4.6-.6 1.5-1.3 3-1.4 4.6a30.1 30.1 0 0 0-.3 3.4V56H34c1.9-.1 3.8-.1 5.6-.8a33 33 0 0 0 4.9-2.3c.7-.4 1.4-1.1 2.3-1H58c-.3.7-.8 1.2-1.3 1.8A30.8 30.8 0 0 1 40 63.9c-1.9.5-3.8.7-5.8.8h-32V32.4a35.3 35.3 0 0 1 1.3-8A31.4 31.4 0 0 1 14.8 8.1a30.4 30.4 0 0 1 15.3-5.9l2-.2z"/><path fill="url(#b)" d="M29.8 15c.8-.4 1.8-.2 2.6-.3h33c.3 0 .6 0 .7.2.1.5-.3.8-.6 1l-8.3 8.6c-.8.7-1.3 1.7-2.4 2-.9.5-1.9.4-2.9.4H19.5c-.3 0-.9 0-1-.4 0-.3.2-.5.4-.6l9-9.2c.6-.6 1.1-1.4 2-1.7z"/><path fill="url(#c)" d="M60.7 26.6c.4-.4.8-1 1.3-1.3h3.2c.3 0 .7 0 1 .2 0 .4-.4.7-.6 1l-9.8 10.1a3.7 3.7 0 0 1-2.5 1H19.5c-.3 0-.6 0-.9-.2-.2-.4.1-.7.3-1l5.2-5.2c.2-.3.5-.3.8-.3h28c1.2 0 2.4-.3 3.6-.7 1.7-.7 2.9-2.3 4.2-3.6z"/><path fill="url(#d)" d="M62 35.8c.2-.2.6-.2.8-.2h2.7c.2 0 .5 0 .6.2.1.4-.3.7-.6 1L55.8 47a3.7 3.7 0 0 1-2.5 1H19.5c-.4 0-.9 0-1-.5 0-.2.3-.5.5-.7l4.7-4.9c.3-.3.6-.3 1-.3h27.7c1.4 0 3-.3 4.3-.8 1.6-.7 2.6-2.1 3.8-3.3l1.5-1.6z"/><defs><linearGradient id="a" x1="57.4" x2="3.3" y1="10.6" y2="65.8" gradientUnits="userSpaceOnUse"><stop stop-color="#4AFFD8"/><stop offset=".3" stop-color="#00CAFF"/><stop offset=".7" stop-color="#2D93FF"/><stop offset="1" stop-color="#007CFF"/></linearGradient><linearGradient id="b" x1="57.4" x2="3.3" y1="10.6" y2="65.8" gradientUnits="userSpaceOnUse"><stop stop-color="#4AFFD8"/><stop offset=".3" stop-color="#00CAFF"/><stop offset=".7" stop-color="#2D93FF"/><stop offset="1" stop-color="#007CFF"/></linearGradient><linearGradient id="c" x1="57.4" x2="3.3" y1="10.6" y2="65.8" gradientUnits="userSpaceOnUse"><stop stop-color="#4AFFD8"/><stop offset=".3" stop-color="#00CAFF"/><stop offset=".7" stop-color="#2D93FF"/><stop offset="1" stop-color="#007CFF"/></linearGradient><linearGradient id="d" x1="57.4" x2="3.3" y1="10.6" y2="65.8" gradientUnits="userSpaceOnUse"><stop stop-color="#4AFFD8"/><stop offset=".3" stop-color="#00CAFF"/><stop offset=".7" stop-color="#2D93FF"/><stop offset="1" stop-color="#007CFF"/></linearGradient></defs></svg>',
      "url": 'https://nspd.gov.ru/map?thematic=PKK&zoom=[z]&coordinate_x=[x]&coordinate_y=[y]&theme_id=1&is_copy_url=true&active_layers=賐%2C賑'
    },
    "map-ru": {
      "title": "Map.ru",
      "icon": '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none"><path fill="url(#a)" d="M0 18C0 10.777 0 7.166 1.733 4.57a10.286 10.286 0 0 1 2.838-2.838C7.166 0 10.777 0 18 0s10.834 0 13.429 1.733a10.285 10.285 0 0 1 2.838 2.838C36 7.166 36 10.777 36 18s0 10.834-1.734 13.429a10.285 10.285 0 0 1-2.837 2.838C28.834 36 25.223 36 18 36S7.166 36 4.571 34.267a10.285 10.285 0 0 1-2.838-2.838C0 28.834 0 25.223 0 17.999Z" style="display:inline"/><path fill="#fff" d="M9.197 24.218c-3.986-4.217-3.789-11.077.394-15.03 4.183-3.955 10.824-3.997 15.03.451 2.323 2.459 3.374 5.124 3.222 10.519.034 1.656.11 3.019.166 4.052.076 1.376.12 2.168-.009 2.29-.1.094-.492-.165-.988-.495-.63-.417-1.427-.946-2.012-1.005-8 4-13.303 1.863-15.803-.782zm11.58-2.293a6.346 6.346 0 1 0-7.753-10.048 6.346 6.346 0 0 0 7.754 10.048z" clip-rule="evenodd" style="display:inline;filter:url(#b)"/><defs><radialGradient id="a" cx="0" cy="0" r="1" gradientTransform="rotate(44.283 -13.565 30.021) scale(22.1998)" gradientUnits="userSpaceOnUse"><stop offset=".559" stop-color="#6D93FF"/><stop offset="1" stop-color="#5D87FF"/></radialGradient><filter id="b" width="29.756" height="28.954" x="2.327" y="4.26" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" lonult="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" lonult="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="2"/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"/><feBlend in2="BackgroundImageFix" lonult="effect1_dropShadow_2118_10855"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_2118_10855" lonult="shape"/></filter></defs></svg>',
      "url": 'https://map.ru/pkk?lon=[lat]&lat=[lon]&z=[z]'
    },
    "2gis": {
      "title": "2ГИС",
      "icon": '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none" viewBox="0 0 112.8 112.8"><defs><path id="a" fill="#fff" fill-rule="evenodd" stroke-width="3.4" d="M30.2 18h16.1a23.2 23.2 0 0 1 2.7.2 7.4 7.4 0 0 1 2 .7 7 7 0 0 1 1.8 1.2 6.9 6.9 0 0 1 1.3 1.8c.3.7.6 1.3.7 2a14 14 0 0 1 .2 3.2v14.8a41 41 0 0 1-.2 3.1 7.2 7.2 0 0 1-.7 2.1 6.9 6.9 0 0 1-1.3 1.7 7 7 0 0 1-1.7 1.3 7.4 7.4 0 0 1-2.1.7l-2.2.2H30.7a27.2 27.2 0 0 1-.5 0c-.7 0-1.5 0-2.2-.2a7.4 7.4 0 0 1-2-.7 7 7 0 0 1-3.1-3 7.2 7.2 0 0 1-.7-2 14 14 0 0 1-.2-3.2V28.3a154 154 0 0 1 .2-4.4 7.2 7.2 0 0 1 .7-2 7 7 0 0 1 3-3 7.4 7.4 0 0 1 2.1-.7l2.2-.2z" clip-rule="evenodd"/></defs><defs><mask id="f" maskUnits="userSpaceOnUse"><use xlink:href="#a" fill-rule="evenodd" stroke-width="3.4" clip-rule="evenodd"/></mask><mask id="e" maskUnits="userSpaceOnUse"><use xlink:href="#a" fill-rule="evenodd" stroke-width="3.4" clip-rule="evenodd"/></mask><mask id="d" maskUnits="userSpaceOnUse"><use xlink:href="#a" fill-rule="evenodd" stroke-width="3.4" clip-rule="evenodd"/></mask><mask id="c" maskUnits="userSpaceOnUse"><use xlink:href="#a" fill-rule="evenodd" stroke-width="3.4" clip-rule="evenodd"/></mask><mask id="b" maskUnits="userSpaceOnUse"><use xlink:href="#a" fill-rule="evenodd" stroke-width="3.4" clip-rule="evenodd"/></mask></defs><path fill="#19aa1e" d="M22 18h33v33H22Z" mask="url(#b)" transform="matrix(3.4 0 0 3.4 -75.2 -61.5)"/><path fill="#ffb919" fill-rule="evenodd" d="M22 18h33v10.8l-33-5.1Z" clip-rule="evenodd" mask="url(#c)" transform="matrix(3.4 0 0 3.4 -75.2 -61.5)"/><path fill="#82d714" fill-rule="evenodd" d="m22 47.4 33-5.2V51H22Z" clip-rule="evenodd" mask="url(#d)" transform="matrix(3.4 0 0 3.4 -75.2 -61.5)"/><path fill="#fff" fill-rule="evenodd" d="m22 23 11.5 1.8a9.7 9.7 0 0 1 5-1.4 9 9 0 0 1 7.1 3.3l9.4 1.5v1.3l-8.4-1.3a8.5 8.5 0 0 1 1 3.9c0 1.7-.5 3.5-1.3 5.3l-.4.8h-.8c-1.7 0-2.8.5-3.5 1.4a4 4 0 0 0-1 2.7v.2l-.1.2v1.2L55 41.6v1.3L22 48v-1.3l14.6-2.2V44l-.1-1.4v-.3c-.1-1-.5-2-1-2.7-.8-.9-1.9-1.4-3.6-1.4h-.8l-.4-.8c-.8-1.8-1.2-3.5-1.2-5.3 0-2.3.9-4.4 2.5-6l.1-.2L22 24.3Z" clip-rule="evenodd" mask="url(#e)" transform="matrix(3.4 0 0 3.4 -75.2 -61.5)"/><path fill="#0073fa" fill-rule="evenodd" d="M38.5 24.7c4.6 0 7.7 3.5 7.7 7.4 0 1.5-.3 3.1-1 4.8-4.6 0-5.7 3.2-6 5.3V44l-1.3.2a23.5 23.5 0 0 0-.1-2c-.2-2.1-1.3-5.4-6-5.4-.7-1.7-1-3.3-1-4.8 0-3.9 3-7.4 7.7-7.4z" clip-rule="evenodd" mask="url(#f)" transform="matrix(3.4 0 0 3.4 -75.2 -61.5)"/></svg>',
      "url": 'https://2gis.ru/?m=[lat]%2C[lon]%2F[z]'
    },
    "google": {
      "title": "Google Earth",
      "icon": '<svg xmlns="http://www.w3.org/2000/svg" xml:space="plonerve" viewBox="0 0 4482 4483"><path fill="#255fdb" d="M1545 2708C782 1698-3 2466 202 3172a2242 2242 0 0 0 3922 287c-591 553-1663 460-2579-751z"/><path fill="#4285f4" d="M2228 2012C1178 419 0 1268 0 2242c0 322 69 641 204 934-140-660 618-1169 1324-222 1025 1375 2031 1133 2594 508 180-278 297-592 341-920v4c-241 750-1308 872-2235-534z"/><path fill="#91bfff" d="M2949 1299C2168 12 1179 128 509 818A2234 2234 0 0 0 0 2242c70-943 1210-1598 2241 0 917 1422 2059 1051 2221 308v-7c14-101 20-203 18-305v-102c-397 284-919 174-1531-837z"/><path fill="#c4e1ff" d="M2954 1529c714 1148 1330 854 1528 609-8-172-36-342-83-508-333 7-411-48-738-547-501-768-1132-1286-2235-929a2253 2253 0 0 0-917 665c758-697 1687-508 2445 710z"/><path fill="#f5f5f5" d="M3612 1182c326 499 525 525 787 448A2244 2244 0 0 0 1426 154c985-311 1684 260 2186 1028z"/></svg>',
      "url": 'https://earth.google.com/web/@[lon],[lat],[z]z'
    },
    "retromap": {
      "title": "Retromap",
      "icon": '<svg xmlns="http://www.w3.org/2000/svg" xml:space="plonerve" viewBox="0 0 420 420"><circle cx="215.188" cy="210.469" r="200" fill="#695242"/><path fill="none" stroke="#3e2120" stroke-width="20" d="M285.16 31.17c75.95 146.45 27.85 294.43-119.69 368.24M28.31 280.49c105.82-33.43 221.27 4.1 287.21 93.35M258.16 20.4C109.59 94.82 61.18 243.75 137.64 391.21M269.32 24.24C166.71-8.48 57.06 48.1 24.24 150.68-8.48 253.29 48.1 362.94 150.68 395.76c102.58 32.81 212.26-23.86 245.08-126.44C428.33 167.5 372.71 58.47 271.23 24.86Zm.96.31-120.55 370.9m245.72-125.17L24.55 149.72m78.1-97.95c65.94 89.25 181.4 126.78 287.21 93.35"/><path fill="#fff" d="M147.56 117.465c-8.53 0-16.72 2.6-24.57 7.8-7.86 5.09-15.33 12.84-22.42 23.25v-26.4H76.83v180.621h23.74v-61.09c0-31.32 1.44-52.131 4.32-62.421 3.76-13.39 9.24-23.24 16.44-29.55 7.19-6.42 14.66-9.63 22.41-9.63 3.32 0 7.41 1.05 12.28 3.15l12.12-19.59c-7.3-4.09-14.16-6.14-20.58-6.14zm115.532 0c-29.88 0-53.731 11.401-71.551 34.201-14.06 17.93-21.08 38.35-21.08 61.26 0 24.35 8.3 46.21 24.9 65.58 16.6 19.25 39.62 28.879 69.06 28.879 13.28 0 25.18-1.989 35.69-5.969 10.52-4.1 19.981-10.02 28.391-17.77 8.41-7.74 15.83-17.93 22.25-30.54l-19.592-10.301c-7.08 11.85-13.67 20.42-19.76 25.74-6.08 5.31-13.5 9.571-22.24 12.781a76.141 76.141 0 0 1-26.728 4.809c-19.04 0-35.03-6.69-47.98-20.08-12.95-13.51-19.65-30.77-20.09-51.8H356.73c-.23-24.68-6.87-45.269-19.93-61.759-18.37-23.35-42.938-35.031-73.708-35.031zm.33 22.25c10.74 0 20.979 2.27 30.719 6.8 9.74 4.54 17.54 10.52 23.41 17.93 5.97 7.42 10.51 17.321 13.61 29.721H196.69c4.76-16.6 11.78-29.05 21.08-37.35 12.73-11.4 27.95-17.101 45.65-17.101z" font-family="Century Gothic" font-size="340" font-weight="400" style="-inkscape-font-specification:&quot;Century Gothic&quot;;text-align:start"/></svg>',
      "url": 'https://retromap.ru/z[z]_[lon],[lat]'
    },
    "starva": {
      "title": "Starva",
      "icon": '<svg xmlns="http://www.w3.org/2000/svg" xml:space="plonerve" viewBox="0 0 512 512"><path fill="#f50" d="M226.172 26.001 90.149 288.345h80.141l55.882-104.309 55.433 104.309h79.511z"/><path fill="#ffaf8a" d="m361.116 288.345-39.441 79.241-40.07-79.241h-60.734l100.804 197.654 100.176-197.654z"/></svg>',
      "url": 'https://www.strava.com/maps/global-heatmap?sport=All&style=satellite&terrain=false&labels=false&poi=false&cPhotos=false&gColor=blue&gOpacity=100#[z]/[lon]/[lat]'
    },
    "osm": {
      "title": "OpenStreetMap",
      "icon": '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 256 256"><defs><path id="reuse-0" fill="#ceeeab" d="M9 2.25s7.5 13 11.75 27.75A301.3 301.3 0 0 1 27 55.5s-5.5 12.75-8.25 24.75-5.75 23-5.75 23 5.75 16 9.25 30S26 157.5 26 157.5s-4 10.25-7.5 24.25-5 30.75-5 30.75 9.25-2 28.5 1.25 32.25 6 32.25 6 12.75-2.75 24-6.25 16.25-6.5 16.25-6.5 5.5.5 22.5 6.25 29.25 8.5 29.25 8.5 13-2.75 26-5.75 26.5-8 26.5-8-.75-5 4.25-24.5 8.75-28 8.75-28-.5-4.5-3.75-19.75S218 106 218 106s1.75-10.5 6.75-23.75S235 55.5 235 55.5s-4.75-15.25-7.5-29.75S219.25 0 219.25 0 195 9 187.5 10.5s-21 5.25-21 5.25-9.75-4.25-22-8.5-29.75-5.5-29.75-5.5-3.25 3.5-22 8-27.5 5.75-27.5 5.75-18.5-9-31.5-11.5S9.75 2 9 2.25Z"/></defs><defs><linearGradient id="k"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><linearGradient id="a"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><linearGradient id="b"><stop offset="0" stop-color="#2d3335"/><stop offset=".5" stop-color="#4c464a"/><stop offset="1" stop-color="#384042"/></linearGradient><linearGradient id="c"><stop offset="0" stop-color="#2d3335"/><stop offset=".5" stop-color="#4c464a"/><stop offset="1" stop-color="#384042"/></linearGradient><linearGradient id="d"><stop offset="0" stop-color="#f9e295"/><stop offset=".13" stop-color="#f7dd84"/><stop offset=".21" stop-color="#fff"/><stop offset=".3" stop-color="#f4ce51"/><stop offset=".34" stop-color="#f9e7aa"/><stop offset="1" stop-color="#efbb0e"/></linearGradient><linearGradient id="e"><stop offset="0" stop-color="#f9e295"/><stop offset=".13" stop-color="#f7dd84"/><stop offset=".21" stop-color="#fff"/><stop offset=".3" stop-color="#f4ce51"/><stop offset=".34" stop-color="#f9e7aa"/><stop offset="1" stop-color="#efbb0e"/></linearGradient><linearGradient id="f"><stop offset="0" stop-color="#f9e295"/><stop offset=".13" stop-color="#f7dd84"/><stop offset=".21" stop-color="#fff"/><stop offset=".3" stop-color="#f4ce51"/><stop offset=".34" stop-color="#f9e7aa"/><stop offset="1" stop-color="#efbb0e"/></linearGradient><linearGradient id="g"><stop offset="0" stop-color="#f9e295"/><stop offset=".13" stop-color="#f7dd84"/><stop offset=".21" stop-color="#fff"/><stop offset=".3" stop-color="#f4ce51"/><stop offset=".34" stop-color="#f9e7aa"/><stop offset="1" stop-color="#efbb0e"/></linearGradient><linearGradient id="h"><stop offset="0" stop-color="#2d3335"/><stop offset=".5" stop-color="#4c464a"/><stop offset="1" stop-color="#384042"/></linearGradient><linearGradient id="i"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><linearGradient id="j"><stop offset="0" stop-color="#d0e9f2" stop-opacity="0"/><stop offset=".84" stop-color="#d0e9f2" stop-opacity="0"/><stop offset=".94" stop-color="#d0e9f2" stop-opacity=".28"/><stop offset="1" stop-color="#d0e9f2"/></linearGradient><linearGradient xlink:href="#k" id="T" x1="126.64" x2="179.96" y1="29.81" y2="137.2" gradientTransform="translate(.4 -6.87)" gradientUnits="userSpaceOnUse"/><linearGradient id="l"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><linearGradient xlink:href="#l" id="U" x1="126.64" x2="179.96" y1="29.81" y2="137.2" gradientTransform="matrix(-.5 .2 .2 -.43 272.63 123.8)" gradientUnits="userSpaceOnUse"/><linearGradient id="m"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><linearGradient id="n"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><linearGradient id="o"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><linearGradient id="p"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#fff" stop-opacity=".93"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><linearGradient id="q"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><linearGradient id="r"><stop offset="0"/><stop offset="1" stop-opacity="0"/></linearGradient><linearGradient id="s"><stop offset="0"/><stop offset="1" stop-opacity="0"/></linearGradient><linearGradient id="t"><stop offset="0"/><stop offset="1" stop-opacity="0"/></linearGradient><linearGradient id="u"><stop offset="0" stop-color="#d0e9f2" stop-opacity="0"/><stop offset=".84" stop-color="#d0e9f2" stop-opacity="0"/><stop offset=".94" stop-color="#d0e9f2" stop-opacity=".28"/><stop offset="1" stop-color="#d0e9f2"/></linearGradient><linearGradient id="v"><stop offset="0"/><stop offset="1" stop-opacity="0"/></linearGradient><linearGradient xlink:href="#t" id="w" x1="210.17" x2="9" y1="72.06" y2="-213.25" gradientTransform="matrix(1 -.08 0 1 0 203.06)" gradientUnits="userSpaceOnUse"/><radialGradient xlink:href="#u" id="x" cx="128" cy="86" r="47" fx="128" fy="86" gradientTransform="matrix(1 1 1 -1 -40.84 43.25)" gradientUnits="userSpaceOnUse"/><radialGradient xlink:href="#u" id="y" cx="128" cy="86" r="47" fx="128" fy="86" gradientTransform="matrix(1 1 1 -1 -40.84 43.25)" gradientUnits="userSpaceOnUse"/><radialGradient xlink:href="#u" id="z" cx="128" cy="86" r="47" fx="128" fy="86" gradientTransform="matrix(1 1 1 -1 -40.84 43.25)" gradientUnits="userSpaceOnUse"/><radialGradient xlink:href="#u" id="A" cx="128" cy="86" r="47" fx="128" fy="86" gradientTransform="matrix(1 1 1 -1 -40.84 43.25)" gradientUnits="userSpaceOnUse"/><radialGradient xlink:href="#u" id="B" cx="128" cy="86" r="47" fx="128" fy="86" gradientTransform="matrix(1 1 1 -1 -40.84 43.25)" gradientUnits="userSpaceOnUse"/><radialGradient xlink:href="#u" id="C" cx="128" cy="86" r="47" fx="128" fy="86" gradientTransform="matrix(1 1 1 -1 -40.84 43.25)" gradientUnits="userSpaceOnUse"/><radialGradient xlink:href="#u" id="D" cx="128" cy="86" r="47" fx="128" fy="86" gradientTransform="matrix(1 1 1 -1 -40.84 43.25)" gradientUnits="userSpaceOnUse"/><radialGradient xlink:href="#u" id="E" cx="128" cy="86" r="47" fx="128" fy="86" gradientTransform="matrix(1 1 1 -1 -40.84 43.25)" gradientUnits="userSpaceOnUse"/><radialGradient xlink:href="#u" id="F" cx="128" cy="86" r="47" fx="128" fy="86" gradientTransform="matrix(1 1 1 -1 -40.84 43.25)" gradientUnits="userSpaceOnUse"/><radialGradient xlink:href="#u" id="G" cx="128" cy="86" r="47" fx="128" fy="86" gradientTransform="matrix(1 1 1 -1 -40.84 43.25)" gradientUnits="userSpaceOnUse"/><radialGradient xlink:href="#u" id="H" cx="128" cy="86" r="47" fx="128" fy="86" gradientTransform="matrix(1 1 1 -1 -40.84 43.25)" gradientUnits="userSpaceOnUse"/><radialGradient xlink:href="#u" id="I" cx="128" cy="86" r="47" fx="128" fy="86" gradientTransform="matrix(1 1 1 -1 -40.84 43.25)" gradientUnits="userSpaceOnUse"/><radialGradient xlink:href="#u" id="J" cx="128" cy="86" r="47" fx="128" fy="86" gradientTransform="matrix(1 1 1 -1 -40.84 43.25)" gradientUnits="userSpaceOnUse"/><clipPath id="R" clipPathUnits="userSpaceOnUse"><path fill="url(#w)" d="M9 22.58s7.5 12.4 11.75 26.8 6.25 25 6.25 25-5.5 13.19-8.25 25.41S13 123.25 13 123.25s5.75 15.54 9.25 29.26c3.5 13.71 3.75 23.94 3.75 23.94s-4 10.58-7.5 24.86-5 31.15-5 31.15 9.25-2.74 28.5-1.05c19.25 1.7 32.25 3.4 32.25 3.4s12.75-3.79 24-8.2c11.25-4.41 16.25-7.81 16.25-7.81s5.5.05 22.5 4.43c17 4.37 29.25 6.13 29.25 6.13s13-3.8 26-7.85 26.5-10.15 26.5-10.15-.75-4.94 4.25-24.84 8.75-28.7 8.75-28.7-.51-4.46-3.75-19.45c-1.75-8.11-2.25-4.07-2.25-4.07s16.26-26.16 16.5-40.34c.25-15.02-7.25-36.41-7.25-36.41s-4.75-14.87-7.5-29.14a105.1 105.1 0 0 0-8.25-25.09S195 14.3 187.5 16.4c-7.5 2.1-21 6.95-21 6.95s-9.75-3.46-22-6.72-29.75-3.1-29.75-3.1-3.25 3.77-22 9.78c-18.75 6.02-27.5 7.98-27.5 7.98s-18.5-7.5-31.5-8.95c-13-1.45-24-.06-24.75.25z" opacity=".04"/></clipPath><clipPath id="K" clipPathUnits="userSpaceOnUse"><use xlink:href="#reuse-0"/></clipPath><clipPath id="M" clipPathUnits="userSpaceOnUse"><use xlink:href="#reuse-0"/></clipPath><clipPath id="L" clipPathUnits="userSpaceOnUse"><use xlink:href="#reuse-0"/></clipPath><clipPath id="P" clipPathUnits="userSpaceOnUse"><path fill="url(#y)" stroke-width="1.25" d="M127.03 132.72a66.81 66.81 0 1 0 94.5-94.5 66.81 66.81 0 0 0-94.5 94.5z"/></clipPath><clipPath id="N" clipPathUnits="userSpaceOnUse"><path fill="url(#z)" stroke-width="1.25" d="M127.03 132.72a66.81 66.81 0 1 0 94.5-94.5 66.81 66.81 0 0 0-94.5 94.5z"/></clipPath><clipPath id="O" clipPathUnits="userSpaceOnUse"><path fill="url(#A)" stroke-width="1.25" d="M127.03 132.72a66.81 66.81 0 1 0 94.5-94.5 66.81 66.81 0 0 0-94.5 94.5z"/></clipPath><clipPath id="Q" clipPathUnits="userSpaceOnUse"><path fill="url(#J)" stroke-width="1.25" d="M127.03 132.72a66.81 66.81 0 1 0 94.5-94.5 66.81 66.81 0 0 0-94.5 94.5z"/></clipPath><filter id="S" width="1.1" height="1.1" x="-.05" y="-.05"><feGaussianBlur stdDeviation="4.29"/></filter></defs><use xlink:href="#reuse-0"/><path fill="#a6dd8b" d="m110.75-4.5-4.25 7c-.75 9-2.25 13.75-8.5 16.5s-12.25 3.5-11 7.5 13 9.25 14.25 13 8.25 1.75 11 7 2 15.25-3.75 17.25-17.5.5-20.25 9.5-4.75 10.5-9 12.75-7.25 10.5-3.5 16.5 12.25-1.25 15-6.5S98 87.25 98 87.25h23.75l59-1.75 3.25-3.75s3.25 4 2.75 8.75-3.75 14.75.25 17.25 19.5-2 24-7-4.75-28.25-10.5-29.5-18.5-1.75-17-7 11.75 4.5 17.25 3.25 16.75-21 12-25.25-24.25-5.25-25.75-8 21-8 22.25-11-2.5-7.25-6.25-8.5S189 31 182 30.5s-20 5.75-17.25 11.5-6 11-14.5 6.5-24.75-13-21.75-24S150 5.75 150 5.75zM97.19 102.72c-1.6.15-4.47 4.69-4.94 7.03-.5 2.5-3.25 6.75-3.5 12.25s4.75 6.75 8.75 6.5 2.75-6.75 2-15c-.33 0-.37-10.96-2.31-10.78zm92.72 51.66c-6.34.29-6.63 7.46-7.41 8.87-1.25 2.25 2.25 13.75 2 18s-4.75 5.25-9.5 9.75.5 16 11.25 31l44.75 1.25-1-35s4.75-4.25-20.75-24.25c-9.56-7.5-15.54-9.8-19.34-9.63zM39.94 170.9c-4.03-.1-8.28 5.72-9.69 7.59-1.5 2-6.25 5-17 9.5l-14.5 34.25 53 4.25s1.75-11-4.25-15.75S30.25 205 29.25 197.5s9.25-10 13.75-14.25S45 172 40.75 171a4.02 4.02 0 0 0-.81-.1z" clip-path="url(#K)"/><path fill="#aac3e7" d="M98.5 85.5c-13.5 6.25-13.25 38-14.75 44.5s-17.5 20.75-20 23.5-13.25 7.25-19.5 8.5-12.75 7.25-15.5 11c-2.02 2.76-7.4 6.45-10.13 8.22l-.12.53-.38 1.63c4.98-1.61 11.18-8.18 16.63-13.63 6.25-6.25 20-7.75 27.75-11.5S76.75 138.5 89 134.5s21.25 11.75 24.25 18.5 1.75 12.75 3.75 17 11 11.75 11.5 13.5-5 6.5-6.25 8.5-10.5 7-11.75 8.75c-.97 1.35-1.92 6.77-2.31 9.22l1.12-.47c.49-2.53 1.52-7.08 2.94-8.5 2-2 11.25-4.5 12.5-8.5s7-6.5 7-6.5 2.75 4 16 14c8.83 6.67 12.76 15.53 14.4 20.72l2.04.53c-1.22-4.32-4.84-16.24-8.94-20.75-5-5.5-18.5-10.75-22.75-22S108 144.25 115 138.25s16.5-4 28.5 7.5 46.25 5.75 57.75 3.75c9.95-1.73 20.83 14.88 23.9 26.03.6-2.1 1.13-4 1.66-5.75a30.86 30.86 0 0 1-5.31-8.28c-3.75-8.5-12-13.25-12-13.25s8.75-5 14.75-7.75c1.62-.74 3-1.68 4.19-2.66l-.44-2.09-.1-.44c-4.76 5.56-19.23 9.62-21.65 10.94-2.75 1.5-18.25 3-35.75 4.5s-26.75-7.5-34.25-14.75c-10.52-10.17 50.39-75.46-37.75-50.5Zm6.69 3.13c7.77 0 10.37 8.94 6.56 10.37-2 .75-12.75 8-10.5 14.25s1.75 18-3.5 18-8 0-10-2.5-2-12 0-19.75 3.5-15 8-18.25c3.1-2.23 6.63-2.13 9.44-2.13zm13.6 73.09c.2.01 1.9 3.51 4.71 7.03 3 3.75 3.25 8.25 3.25 8.25s-4.25-4.75-6-8-2-7.25-2-7.25c0-.03.02-.03.03-.03z"/><path fill="none" stroke="#d38484" stroke-linecap="round" stroke-width="5" d="m57.75 10-8.5 28.25 18 6.25L75 80.75 54 103l9 10.5-11.7 10.13L71.74 154l14-6.75 20.5 18.5L95.75 194l10.25 8.5-2.75 13" clip-path="url(#L)"/><path fill="none" stroke="#d38484" stroke-linecap="round" stroke-width="5" d="m105.75 202.25 12.5-27.75 11-7 27.5 15.75 20.5-3.75-.25-15.75-10.25-6 12.75-26.25 5.75-3.75 38.75-10" clip-path="url(#M)"/><path fill="#ceeeab" d="M221.92 134.04c52.06-52.21 8.51-107.7-30.69-116.7-40.8-9.35-112.16 34.04-81.64 95.4 38.33 77.08 35.26 98.58 112.33 21.3z" clip-path="url(#N)"/><path fill="#a6dd8b" d="M112.79 26.4c3.44 6.67 2.5 19.17-4.7 21.47-72.58 37.22-32.12 28.53 16.6 29.9l73.9-.1s2.07-5.01 4.07-4.58c3.77.81 4.07 5.12 3.44 11.06-.62 5.93-4.7 18.34.31 21.61 5.02 3.27 24.43-1.81 30.07-7.92 5.63-6.1-5.95-35.55-13.16-37.32-7.2-1.77-23.17-2.84-21.29-9.37 1.88-6.52 14.72 6.05 21.6 4.68 6.9-1.37 20.99-25.7 15.04-31.2 19.15-36.85-65.76-28.25-60.12-2.01 3.44 7.3-7.52 13.57-18.17 7.63-44.58-24.86-85.55-59.21-47.6-3.85ZM93.92 96.28c-47.43 35.38 35.9 39.16.4.05a1 1 0 0 0-.4-.05z" clip-path="url(#O)"/><path fill="#aac3e7" d="M170.76 64.16c-5.97-.18-11.32.9-14.45 3.55-10.02 8.48-43.84-.3-60.74 7.05-32.05 13.93-12.2 93.9 20.66 66.66 8.77-7.27 20.67-4.43 35.7 10.4 41.88 41.32 62.14 58.39-9.08-12.47-9.4-9.35-16.28-45.55-3.76-47.7 12.53-2.15 25.05 17.93 37.58 22.35 12.52 4.43 26.93-18.96 24.73-33.12-1.5-9.73-17.53-16.3-30.64-16.72zm-66.82 14.75c1.6.05 7.34 2.2 8.22 3.2 2.82 3.22 2.5 9.16 0 10.03-2.5.87-15.97 9.57-13.15 17.48-4.6 52.88-36.43-31.96 4.93-30.7z" clip-path="url(#P)"/><path fill="none" stroke="#d38484" stroke-linecap="round" stroke-width="7" d="m181.05 167.67 15.97-32.43 7.2-4.49 48.54-11.15" clip-path="url(#Q)"/><path fill="#2d3335" d="M174.28 35.88c-17.6 0-35.2 6.63-48.72 19.9l-.5.47a69.66 69.66 0 0 0-12.47 81.5s2.66 9.93 5.82 13.75l-13.32 13.34a21.12 21.12 0 0 0-4.56-1.37l-2.84 2.84a9.48 9.48 0 0 0-3.06-.87L30.5 229.56c-.04 1.1.23 2.19.66 3.28l-.54.53-1.09 1.1A18.11 18.11 0 0 0 35 244.75c3.46 3.46 6.42 4.63 10.28 5.47l1.1-1.1.71-.71c1.1.46 2.13.78 3.1.84l64.12-64.13c-.24-.97-.62-1.93-1.03-2.9l3-3c-.25-1.73-.68-3.2-1.31-4.6l13.28-13.28c3.82 3.16 13.75 5.82 13.75 5.82a69.66 69.66 0 0 0 81.5-12.47c.17-.17.3-.34.47-.5a69.6 69.6 0 0 0-49.69-118.31Zm-.5 3.28h.31a65.36 65.36 0 0 1 5.72.37l.28.03.28.03.44.07c.9.1 1.8.22 2.69.37.62.1 1.23.23 1.84.34.35.07.7.12 1.03.2a66 66 0 0 1 2.16.5c.31.07.63.13.94.21l.22.06c.95.26 1.9.52 2.84.82l.22.06c.95.3 1.9.62 2.84.97l.16.06c.95.35 1.9.73 2.84 1.13l.16.06c.94.4 1.88.83 2.81 1.28l.13.06c.93.45 1.86.91 2.78 1.4l.1.07c.92.5 1.83 1.01 2.74 1.56.03.02.06.05.1.06.9.56 1.8 1.13 2.68 1.72.55.37 1.09.77 1.63 1.16l1.1.78c.01.02.04.02.05.03a70.63 70.63 0 0 1 12.22 11.69l.03.03c.7.86 1.41 1.72 2.07 2.6.28.37.54.77.81 1.15l1.1 1.56c.01.03.04.04.06.07a68 68 0 0 1 1.71 2.68l.07.1c.54.9 1.06 1.83 1.56 2.75l.06.1c.5.91.96 1.83 1.4 2.77l.07.13c.45.93.88 1.87 1.28 2.81l.06.16c.4.93.78 1.9 1.13 2.84l.06.16c.35.94.67 1.88.97 2.84l.06.22c.3.94.56 1.9.82 2.84l.06.22.22.94c.17.72.35 1.43.5 2.16.07.34.12.68.18 1.03.12.61.25 1.22.35 1.84.15.9.26 1.8.37 2.69l.07.44.03.28.03.28a65.84 65.84 0 0 1 .37 5.72v.3a65.63 65.63 0 0 1-.18 5.95l-.04.37a64.67 64.67 0 0 1-.71 5.63l-.04.25c-.02.12-.03.25-.06.37a64.56 64.56 0 0 1-1.34 5.78l-.53 1.75c-.18.57-.34 1.13-.53 1.69-.3.86-.6 1.7-.94 2.56l-.19.47-.12.34a62.9 62.9 0 0 1-2.32 5.04l-.25.47c-.41.8-.83 1.59-1.28 2.37l-.28.5-.62 1c-.37.6-.75 1.17-1.13 1.75v.03c-.49.75-1 1.49-1.53 2.22-.46.64-.95 1.25-1.44 1.87-.2.26-.36.53-.56.79l-.4.5-.5.59a66.52 66.52 0 0 1-3.6 3.97c-.16.16-.3.34-.47.5-21.13 21.13-52.26 24.5-77.19 11.15l.13-.18a65.48 65.48 0 0 1-10.63-6.78c-.54-.43-1.06-.87-1.59-1.32-.51-.43-1.03-.86-1.53-1.3l-.28-.26a70.64 70.64 0 0 1-2.4-2.31c-.8-.8-1.57-1.59-2.32-2.4l-.25-.29c-.45-.5-.88-1.02-1.31-1.53-.45-.53-.9-1.05-1.32-1.6a65.48 65.48 0 0 1-6.78-10.62l-.19.13c-13.33-24.93-9.97-56.06 11.16-77.2l.5-.46a68.23 68.23 0 0 1 3.97-3.6l.81-.68c.35-.28.72-.51 1.06-.78.63-.49 1.24-.98 1.88-1.44.74-.53 1.5-1.04 2.25-1.53l1.75-1.13c.45-.27.9-.55 1.34-.8.69-.4 1.37-.77 2.07-1.13l.53-.29a63.59 63.59 0 0 1 5.43-2.53l.47-.15c.97-.39 1.93-.76 2.91-1.1.56-.19 1.12-.35 1.69-.53l1.75-.53c.88-.24 1.77-.48 2.65-.69.07-.01.15-.01.22-.03.42-.1.84-.2 1.25-.28.67-.14 1.36-.29 2.03-.4l.25-.04a65.2 65.2 0 0 1 8.78-.9 65.1 65.1 0 0 1 3.16-.03z" clip-path="url(#R)" filter="url(#S)" transform="matrix(1 .08 0 1 0 -21.06)"/><path fill="#efbb0e" d="m48.01 227.46-4.8 4.55c-5.01-5.31-10.25-10.7-15.09-16.13l4.5-4.07c6.82 6.53 8.87 8.53 15.39 15.65z"/><path fill="#2d3335" d="M123.13 135.93c-27.18-27.18-25.44-73.67 1.74-100.85 27.18-27.18 73-27.27 100.19-.1 27.18 27.19 27.13 73.36-.05 100.54-27.18 27.18-74.7 27.6-101.88.41zm4.89-4.2c26.09 26.1 66.72 25.42 92.81-.67 26.1-26.1 25.8-65.76-.3-91.85-26.08-26.1-66.16-25.97-92.25.12-26.1 26.1-26.36 66.31-.26 92.4z"/><path fill="#2d3335" d="M124.82 134.93a22.27 22.27 0 0 1 4.12 5.72l-26.2 26.2c-2.06-1.03-4-2.38-5.73-4.11a22.27 22.27 0 0 1-4.12-5.72l26.2-26.21c2.06 1.04 4 2.4 5.73 4.12z"/><path fill="#efbb0e" d="M116.27 159.23 50.2 225.3c-3.99-2.2-5.83-3-9.3-6.46-3.45-3.46-4.26-5.3-6.45-9.29l66.07-66.07c5.06 3.75 12.12 10.4 15.75 15.75z"/><path fill="#2d3335" d="M105.78 154.12c3.46 3.46 7.43 6.66 8.52 11.02l-64.1 64.1c-6.52-5.16-14.56-12.8-19.69-19.69l64.1-64.1c3.5.23 7.66 5.16 11.12 8.62z"/><path fill="url(#T)" d="M131.56 40.18c40.66-32.17 78.13-12.73 77.78 5.3-.35 18.04-56.57 70.36-76.37 66.12-19.8-4.24-25.45-53.39-1.41-71.42z" opacity=".6"/><path fill="url(#U)" d="M215.94 129.48c-26.8 21.98-41.8 21-38.07 13.14 3.73-7.87 42.32-41.66 51.44-43.75 9.12-2.1 2.28 18.04-13.37 30.61z" opacity=".77"/></svg>',
      "url": 'https://www.openstreetmap.org/#map=17/[lon]/[lat]'
    },
    "here": {
      "title": "Here",
      "icon": '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 37"><path d="m 22.765806,25.019163 -11,11 -10.99999993,-11 z" fill="#65c1c2"></path><path d="m 32.965806,4.6191631 c -4.5,-4.50000003 -9.4,-2.9 -11.8,-0.5 -1.9,1.9 -3,4.4 -2.5,6.1999999 l -9.6999999,-9.69999993 -5.2,5.20000003 19.1999999,19.1999999 h 10.3 l -6.9,-6.9 c -3.6,-3.7 -3.7,-5.6 -1.9,-7.4 1.7,-1.6999999 3.7,-0.6 7.2,2.8 l 6.8,6.8 5.1,-5.1 c -7.171545,-6.9849039 -7.066667,-7.0666669 -10.6,-10.5999999 z"></path></svg>',
      "url": 'https://wego.here.com/?map=[lon],[lat],17,satellite&x=ep'
    },
    "wikimapia": {
      "title": "Wikimapia",
      "icon": '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 470"><path fill="#C00" d="M361.472,220.358V104.648c-63.905,0-115.709,51.805-115.709,115.71 c0,63.905,51.804,115.708,115.709,115.708S477.18,284.264,477.18,220.359c0,0,0,0,0,0L361.472,220.358z"/><path fill="#C00" d="M528.111,220.357c0,0,0,0.001,0,0.001c0,92.034-74.607,166.641-166.64,166.641 c-92.033,0-166.641-74.607-166.641-166.641c0-92.033,74.607-166.641,166.641-166.641v-47h0c-117.99,0-213.64,95.65-213.64,213.64 c0,117.989,95.65,213.641,213.64,213.641s213.641-95.651,213.641-213.641c0,0,0,0,0-0.001H528.111z"/></svg>',
      "url": 'https://wikimapia.org/#lang=ru&lat=[lon]&lon=[lat]&z=17&m=w'
    }
  };

  let settingOpenServices = {};

  chrome.storage.local.get(["nkSetting-openServices"], (lonult) => {
    if (!lonult["nkSetting-openServices"]) {
      const DEFAULT_SETTING = {
        'nspd-gov': false,
        'map-ru': true,
        'retromap':true,
        '2gis': false,
        'google': true,
        'starva': false,
        'osm': false,
        'here': false,
        'wikimapia': false,
        'setting-button': true,
        'setting-button-menu': false,
        'setting-menu': false
      };

      chrome.storage.local.set({"nkSetting-openServices": DEFAULT_SETTING});
      settingOpenServices = DEFAULT_SETTING;
    } else {
      settingOpenServices = lonult["nkSetting-openServices"];
    }
  });


  /**
   * Открытие панели
   */

  const showPanel = () => {
    $(".nk-portal-local .nk-popup").removeClass("nk-popup_visible nk-popup_direction_bottom-right");

    // Если панель уже открыта, то скрываем ее
    if ($(".nk-portal_open-service")[0]) {
      $(".nk-portal_open-service .nk-popup").removeClass("nk-popup_visible");
      setTimeout(() => $(".nk-portal_open-service").remove(), 300);

      return;
    }

    // Добавление панели
    $("body").append('<div class="nk-portal nk-portal_open-service"><!----><div class="nk-popup nk-popup_direction_right-bottom nk-popup_visible nk-popup_theme_islands nk-popup_lontrict-height" style="left: 265px; bottom: 64px; z-index: 1001;"><div class="nk-size-observer"><div class="nk-popup__content"><div class="nk-size-observer"><div class="nk-scrollable nk-scrollable_with-thumb"><div class="nk-scrollable__container" style="max-height: 817px;"><div class="nk-scrollable__content"><div class="nk-size-observer nk-scrollable__content-size-observer"><!----><!----><div class="nk-menu nk-menu_theme_islands nk-menu_mode_check nk-menu_size_m" tabindex="0" style="overflow-y: visible;"></div><!----><!----><!----><!----><!----></div></div></div></div><!----><!----><!----></div><!----></div></div></div></div>');
    const listBlock = $("body .nk-portal_open-service .nk-menu.nk-menu_theme_islands.nk-menu_mode_check.nk-menu_size_m");

    let sourceUrl = window.location.href;
    let lon = sourceUrl.match(/\d{1,3}\.\d*/g)[1];
    let lat = sourceUrl.match(/\d{1,3}\.\d*/g)[0];
    let x = lat * (Math.PI / 180) * 6378137;
    let y = Math.log(Math.tan((Math.PI / 4) + (lon * Math.PI / 180) / 2)) * 6378137;

    const url = new URL(sourceUrl.replace("#!", ""));
    let z = url.searchParams.get('z');

    for (const nameServices in settingOpenServices) {
      if (settingOpenServices[nameServices] && services[nameServices]) {
        listBlock.append('<div class="nk-menu-item nk-menu-item_theme_islands nk-menu-item_size_m nk-menu-item_checked nk-map-layers-control-view__layer nk-map-layers-control-view__layer_id_bld-group"'+ (settingOpenServices["setting-button-menu"] ? " style='padding: 0 10px;padding-left: 30px !important;'" : "" ) +'><span style="'+ (settingOpenServices["setting-button-menu"] ? "height: 19px;left: 9px;position: absolute;width: 18px;margin-top: 3px;" : "height: 25px;left: 15px;position: absolute;width: 25px;margin-top: 3px;") +'">' + services[nameServices].icon + '</span>' + services[nameServices].title + '</div>');

        // При клике на кнопку откроем новую вкладку
        const element = listBlock.find(".nk-menu-item:last-child");

        element.on("click", () => {
          let link = services[nameServices].url;

          if (services[nameServices]?.calc) {
            lon, lat = services[nameServices].calc(lon, lat);
          }

          link = link.replaceAll("[lon]", lon);
          link = link.replaceAll("[lat]", lat);
          link = link.replaceAll("[z]", z);
          link = link.replaceAll("[x]", x);
          link = link.replaceAll("[y]", y);

          chrome.runtime.sendMessage({method: "openPage", link: link});
        });

        element.hover(() => {
          element.addClass("nk-menu-item_hovered");
        }, () => {
          element.removeClass("nk-menu-item_hovered");
        });
      }
    }

    const element = $(".nk-portal_open-service .nk-popup");
    $(document).off("mouseup");
    $(document).mouseup((e) => {
      if (!element.is(e.target) && element.has(e.target).length === 0) {
        $(document).off("mouseup");

        $(".nk-portal_open-service .nk-popup").removeClass("nk-popup_visible");
        setTimeout(() => $(".nk-portal_open-service").remove(), 300);
      }
    });
  };


  /**
   * Инициализация модуля
   */

  const initOpenService = () => {
    if (settingOpenServices["setting-button"]) {
      const menuBlock = $(".nk-map-bottom-controls-view");
      const yandexMapButton = menuBlock.find(".nk-button.nk-button_type_link.nk-button_theme_air.nk-button_size_xl.nk-button_view_dark.nk-map-region-view__button:nth-child(4)");

      yandexMapButton.after('<button aria-disabled="false" class="nk-button nk-button_open-service nk-button_theme_air nk-button_size_xl nk-button_view_dark nk-map-region-view__button" aria-plonsed="false" type="button"><span class="nk-icon nk-icon_id_ruler nk-icon_align_auto"><svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18 2.583c0-.322.261-.583.583-.583h.834c.322 0 .583.26.583.583V4h1.417c.322 0 .583.26.583.583v.833a.583.583 0 0 1-.583.584H20v1.416a.583.583 0 0 1-.583.584h-.834A.583.583 0 0 1 18 7.416V6h-1.417A.583.583 0 0 1 16 5.416v-.833c0-.322.261-.583.583-.583H18V2.583zM14.4 5.1c0-.246.02-.487.057-.722A8.11 8.11 0 0 0 12 4c-4.418 0-8 3.525-8 7.873 0 3.099 1.818 5.778 4.46 7.066 1.727.883 2.767 1.805 3.12 2.767a.447.447 0 0 0 .84 0c.353-.962 1.393-1.884 3.12-2.767 2.643-1.287 4.46-3.966 4.46-7.065 0-.813-.125-1.597-.358-2.335a4.5 4.5 0 0 1-5.242-4.44zm-.114 6.774c0 1.242-1.024 2.25-2.286 2.25s-2.286-1.007-2.286-2.25c0-1.242 1.024-2.25 2.286-2.25s2.286 1.006 2.286 2.25z" fill="currentColor"></path></svg></span></button>');
      const openServiceButton = menuBlock.find(".nk-button_open-service");

      popupShow(openServiceButton, "Перейти на другой картографический сервис");
      openServiceButton.click(showPanel);

      openServiceButton.hover(() => {
        openServiceButton.addClass("nk-button_hovered");
      }, () => {
        openServiceButton.removeClass("nk-button_hovered");
      });
    }

    if (settingOpenServices["setting-menu"]) {
      $(document).on('contextmenu', function () {
        setTimeout(() => {
          const menu = $(".nk-menu-item.nk-menu-item_theme_islands.nk-menu-item_size_s.nk-map-context-menu-view__menu-item-coords").parent();
          if (!menu[0]) return;

          let sourceUrl = window.location.href;
          let lon = sourceUrl.match(/-?\d{1,3}\.\d*/g)[1];
          let lat = sourceUrl.match(/-?\d{1,3}\.\d*/g)[0];
          let x = lat * (Math.PI / 180) * 6378137;
          let y = Math.log(Math.tan((Math.PI / 4) + (lon * Math.PI / 180) / 2)) * 6378137;

          const url = new URL(sourceUrl.replace("#!", ""));
          let z = url.searchParams.get('z');

          $("#nk-service-list").remove();
          menu.append('<div id="nk-service-list"><div style="border-top: 1px solid var(--section--border-color); width: calc(100% - 15px); margin: 5px 7.5px;"></div></div>');

          for (const nameServices in settingOpenServices) {
            if (settingOpenServices[nameServices] && services[nameServices]) {
              $("#nk-service-list").append('<div class="nk-menu-item nk-menu-item_theme_islands nk-menu-item_size_s">' + services[nameServices].title + '</div>');

              // При клике на кнопку откроем новую вкладку
              const element = $("#nk-service-list").find(".nk-menu-item:last-child");

              element.on("click", () => {
                let link = services[nameServices].url;

                link = link.replaceAll("[lon]", lon);
                link = link.replaceAll("[lat]", lat);
                link = link.replaceAll("[z]", z);
                link = link.replaceAll("[x]", x);
                link = link.replaceAll("[y]", y);

                chrome.runtime.sendMessage({method: "openPage", link: link});
              });

              element.hover(() => {
                element.addClass("nk-menu-item_hovered");
              }, () => {
                element.removeClass("nk-menu-item_hovered");
              });
            }
          }
        }, 50);
      });
    }
  };

  window.appChrome.init.openService = initOpenService;
})();
