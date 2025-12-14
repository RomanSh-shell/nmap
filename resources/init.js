'use strict';

/**
 * Запускает добавление модулей
 */

(function () {
  const appPage = $(".nk-app-page");

  const hashStart = window.location.href;


  let checkUpdate = true;
  let startStatus = false;
  let setting = {};
  let user = {};
  let update = {};

  let initFrMosRu = false;

  let loadCount = 0;

  chrome.storage.local.get(["nkSetting"], (result) => setting = result.nkSetting);

  /**
   * Событие клика на кнопку дополнительных инструментов
   */

  const clickToolsButton = () => {
    const toolsButton = $("body > div.nk-app-view > header > div.nk-app-bar-view > button.nk-button.nk-button_theme_air.nk-button_size_xl.nk-tools-control-view");
    toolsButton.off('click', clickToolsButton);

    const toolsMenu = $(".nk-tools-control-view__tools-menu").parent();

    if (startStatus) window.appChrome.init.getUser(toolsMenu);
  };


  /**
   * Создание нового элемента
   *
   * @param parent - Элемент в который нужно добавить новый элемент
   * @param classList - Список классов
   * @param selector - Класс по которому надо найти и вернуть элемент
   * @param text - Текст в элементе
   * @returns {*|jQuery}
   */

  const creatElement = (parent, classList, selector, text = "") => {
    const newElement = document.createElement("div");

    classList.forEach((className) => {
      newElement.classList.add(className);
    });

    newElement.textContent = text;

    $(parent).append(newElement);
    return $(parent).find(selector);
  };


  /**
   * Отображение всплывающей подсказки
   *
   * @param element - Элемент относительно которого нужно показать подсказку
   * @param text - Текст подсказки
   */

  const popupShow = (element, text) => {
    element.hover(() => {
      const popup = $(".nk-portal-local .nk-popup");
      popup.find(".nk-popup__content").text(text);

      let top = element[0].offsetHeight + element.offset().top + 5;
      let left = window.innerWidth - (window.innerWidth - element.offset().left);

      const innerWidth = popup.width() + left;
      const innerHeight = popup.height() + top;

      if (innerWidth >= window.innerWidth) {
        popup.removeClass("nk-popup_direction_bottom-left nk-popup_direction_top-left nk-popup_direction_top-right");
        popup.addClass("nk-popup_direction_bottom-right");

        left = left - popup.width() + element.width();
      } else {
        popup.removeClass("nk-popup_direction_bottom-right nk-popup_direction_top-right nk-popup_direction_top-left");
        popup.addClass("nk-popup_direction_bottom-left");
      }

      if (innerHeight >= window.innerHeight) {
        top = top - popup.height() - element.height() - 10;

        if (popup.hasClass("nk-popup_direction_bottom-right")) {
          popup.removeClass("nk-popup_direction_bottom-right");
          popup.addClass("nk-popup_direction_top-right");
        }else {
          popup.removeClass("nk-popup_direction_bottom-left");
          popup.addClass("nk-popup_direction_top-left");
        }
      }

      popup.css({"left": left + "px", "top": top + "px"});
      popup.addClass("nk-popup_visible");
    }, () => {
      const popup = $(".nk-portal-local .nk-popup");
      popup.removeClass("nk-popup_visible");
    });
  };


  /**
   * Вызывает необходимые события для симуляции нажатия на DOM-элемент.
   * @param {jQuery} element - Элемент, на который нужно симулировать нажатие.
   */
  const triggerClick = (element) => {
    const node = element[0];
    if (!node) return;

    ['mouseover', 'mousedown', 'mouseup', 'click'].forEach(eventType => {
        const event = new MouseEvent(eventType, {
            bubbles: true,
            cancelable: true,
            view: window
        });
        node.dispatchEvent(event);
    });
  };

  /**
   * Эмуляция клика в координатах экрана
   * @param x - Координата X
   * @param y - Координата Y
   */
  const simulateClickByPoint = (x, y) => {
    const el = document.elementFromPoint(x, y);
    if (!el) return;

    ['mousedown', 'mouseup', 'click'].forEach(evtType => {
        const evt = new MouseEvent(evtType, {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y,
            button: 0
        });
        el.dispatchEvent(evt);
    });
  };


  /**
   * Отслеживание загрузки редактора
   *
   * @type {MutationObserver}
   */

  const loadMap = new MutationObserver(() => {
    loadCount++;

    if (loadCount < 3) return;
    loadMap.disconnect();

    /* Добавим всплывающие окна */
    $("body").append('<div class="nk-portal nk-portal-local"><!----><div class="nk-popup nk-popup_direction_bottom-left nk-popup_theme_islands nk-popup_view_tooltip" style="z-index: 111001;"><div class="nk-size-observer"><div class="nk-popup__content"></div></div></div><!----></div><div class="nk-portal nk-select-local"><!----><div class="nk-popup nk-popup_direction_bottom-left nk-popup_theme_islands nk-popup_restrict-height" id="select-status-user"><div class="nk-size-observer"><div class="nk-popup__content"><div class="nk-menu nk-menu_theme_islands nk-menu_mode_check nk-menu_size_m nk-menu_focused nk-select__menu" tabindex="0"><div class="nk-menu-item nk-menu-item_theme_islands nk-menu-item_size_m nk-menu-item_checked nk-select__option" data-value="all" data-i18n="all"></div><div class="nk-menu-item nk-menu-item_theme_islands nk-menu-item_size_m nk-select__option" data-value="active" data-i18n="active"></div><div class="nk-menu-item nk-menu-item_theme_islands nk-menu-item_size_m nk-select__option" data-value="banned" data-i18n="blocked"></div><div class="nk-menu-item nk-menu-item_theme_islands nk-menu-item_size_m nk-select__option" data-value="deleted" data-i18n="deletedUsers"></div></div></div></div></div><!----><!----><!----></div>');
    applyTranslations(); // Apply translations to newly added elements

    /* Критическая ошибка - нет токена */
    if (!JSON.parse(localStorage.getItem("nk:token"))) {
      setTimeout(() => {
        window.appChrome.notification("error", chrome.i18n.getMessage("criticalErrorOccurred"));
      }, 100);
      return;
    }

    /* Ждем клика по аватарке */
    $(".nk-user-bar-view__user-icon").on('click', () => {
      setTimeout(() => {
        const parent = $(".nk-user-bar-view__name + .nk-menu .nk-menu__group:first-of-type");
        const id = chrome.runtime.id;

        if(!parent.find('div[data-link="chrome-extension://' + id + '/index.html"]').length){
          parent.append(`<div class="nk-menu-item nk-menu-item_theme_islands nk-menu-item_size_l" data-link="chrome-extension://${id}/index.html" tabindex="-1" data-i18n="settings"></div>`);
          applyTranslations(); // Apply translations to newly added elements
          const button = parent.find('div[data-link="chrome-extension://' + id + '/index.html"]');

          button.hover(() => {
            button.addClass("nk-menu-item_hovered");
          }, () => {
            button.removeClass("nk-menu-item_hovered");
          });

          button.on("click", () => {
            chrome.runtime.sendMessage({method: "openSetting"});
          });
        }
      }, 10);
    });


    /* Редактор загрузился, теперь ожидаем загрузки дополнительных инструментов для добавления меню */
    setTimeout(() => {
      if (startStatus) {
        const toolsButton = $("body > div.nk-app-view > header > div.nk-app-bar-view > button.nk-button.nk-button_theme_air.nk-button_size_xl.nk-tools-control-view");
        const getUser = hashStart.indexOf("tools/get-user") !== -1 ? hashStart.replace("#!", "") : false;

        if (!!getUser && setting["get-user"] && startStatus) {
          const url = new URL(getUser);
          const getNameUser = getUser.indexOf("name=") !== -1 ? url.searchParams.get('name') : false;

          window.appChrome.getUser(getNameUser);
        }

        toolsButton.on('click', clickToolsButton);

        if (setting["lock-pattern"]) window.appChrome.init.lockPattern();
      }

      const isAddressCheck = hashStart.indexOf("correct=") !== -1 ? hashStart.replace("#!", "") : false;

      if (!!isAddressCheck && setting["check-address"]) {
        const url = new URL(isAddressCheck);
        const getCorrectName = url.searchParams.get('correct');

        window.appChrome.showCorrect(getCorrectName);
      }

      /* Запускаем модули, которые не зависят от дополнительных инструментов */
      if (setting["check-address"]) window.appChrome.init.addressCheck();
      if (setting["get-profile"]) window.appChrome.init.getProfile();
      if (setting["duplicate-addresses"]) window.appChrome.init.addressDuplicate();
      if (setting["tiles"]) window.appChrome.init.tiles();
      if (setting["favorite-objects"]) window.appChrome.init.favoriteObject();
      if (setting["open-service"]) window.appChrome.init.openService();
      if (setting["address"]) window.appChrome.init.address();

      if (setting["fr_mos_ru"] && !initFrMosRu) {
        initFrMosRu = true;

        /* Получение данных из фонда реновации */
        $.ajax({
          type: "POST",
          headers: {
            'content-type': 'text/plain;charset=UTF-8',
          },
          url: setting["fr_mos_ru_api"],
          data: JSON.stringify({ token: setting["fr_mos_ru_token"], login: window.appChrome.user.login }),
          success: (response) => {
            if (response?.objects?.items) {
              const items = response.objects.items.map((item) => {
                const itemNew = Object.assign(item);

                itemNew.name_orign = item.name;
                itemNew.name = item.name
                  .replace(/ ?ул\. ?/gm, " улица ")
                  .replace(/ ?пер\. ?/gm, " переулок ")
                  .replace(/ ?ш\. ?/gm, " шоссе ")
                  .replace(/ ?пл\. ?/gm, " площадь ")
                  .replace(/ ?б-р ?/gm, " бульвар ")
                  .replace(/ ?пр-кт ?/gm, " проспект ")
                  .replace(/ ?пр-д ?/gm, " проезд ")
                  .replace(/,? (д\.|дом) /gm, ", ")
                  .replace(/,? (к\.|корп\.|корпус) /gm, "к")
                  .replace(/,? (с\.|стр\.|строение) /gm, "c")
                  .replace(/,? (влд\.|вл\.|з\/у) /gm, "вл")
                  .replaceAll("улица вл", "улица, вл")
                  .replaceAll("проспект вл", "проспект, вл")
                  .replaceAll("проезд вл", "проезд, вл")
                  .replaceAll("шоссе вл", "шоссе, вл")
                  .replaceAll("бульвар вл", "бульвар, вл")
                  .replaceAll(" ,", ",")
                  .trim();

                return itemNew;
              });

              const street = [];

              items.forEach((item) => {
                const streetItem = item.name.split(",")[0].toLowerCase();

                if (!street[streetItem]) street[streetItem] = { items: [], address: [] };

                street[streetItem].address.push(item.name);
                street[streetItem].items.push(item);
              });

              const address = items.map((item) => item.name);

              window.fr_mos_ru = {
                items: items,
                street: street,
                address: address
              };
            }else {
              if (window.appChrome.notification) {
                window.appChrome.notification("error", chrome.i18n.getMessage("failedToGetRenovationInfo"));
              }else {
                window.needNotification = {
                  status: true,
                  type: "error",
                  text: chrome.i18n.getMessage("failedToGetRenovationInfo")
                };
              }
            }
          },
          error: () => {
            if (window.appChrome.notification) {
              window.appChrome.notification("error", chrome.i18n.getMessage("failedToConnectRenovationFund"));
            }else {
              window.needNotification = {
                status: true,
                type: "error",
                text: chrome.i18n.getMessage("failedToConnectRenovationFund")
              };
            }
          }
        });
      }
    }, 1);

    window.appChrome.init.eventObject(setting);

    setTimeout(() => {
      /* Показываем уведомление, если во время загрузки произошла ошибка, и модуль сообщил о ней */
      if (window.needNotification.status) {
        window.appChrome.notification(window.needNotification.type, window.needNotification.text);
      }
    }, 1000);

    if (update.needUpdate) {
      const manifest = chrome.runtime.getManifest();
      const v = manifest.version_name;

      const infoVersion = !!update.info.length ? update.info : `<span style="color: var(--nk-name-row-layout__name-type--font-color);" data-i18n="noUpdateInformation"></span>`;

      $("body").append(`
        <div class="nk-portal nk-window-update">
          <div class="nk-modal nk-modal_theme_islands nk-modal_visible" role="dialog" aria-hidden="false" style="z-index: 10001;">
            <div class="nk-modal__table">
              <div class="nk-modal__cell">
                <div class="nk-modal__content" tabindex="-1">
                  <div class="nk-data-loss-confirmation-view__text nk-section nk-section_level_2">
                    <strong data-i18n="extensionUpdateAvailable"></strong><br><span data-i18n="goToGithubForUpdate"></span>
                  </div>
                  <div class="nk-grid nk-sidebar-control nk-section nk-section_level_2 nk-info-update">
                    <div class="nk-grid__col nk-grid__col_span_4">
                      <label style="color: var(--sidebar-control__label--font-color);" data-i18n="currentVersion"></label>
                    </div>
                    <div class="nk-grid__col nk-grid__col_span_8">${v}</div>
                  </div>
                  <div class="nk-grid nk-sidebar-control nk-section nk-info-update">
                    <div class="nk-grid__col nk-grid__col_span_4">
                      <label style="color: var(--sidebar-control__label--font-color);" data-i18n="availableVersion"></label>
                    </div>
                    <div class="nk-grid__col nk-grid__col_span_8">${update.lastVersion}</div>
                  </div>
                  <div class="nk-grid nk-sidebar-control nk-section nk-info-update">
                    <div class="nk-grid__col nk-grid__col_span_4">
                      <label style="color: var(--sidebar-control__label--font-color);" data-i18n="whatsNew"></label>
                    </div>
                    <div class="nk-grid__col nk-grid__col_span_8">${infoVersion}</div>
                  </div>
                  <div class="nk-form-submit-view nk-form-submit-view_size_l">
                    <button class="nk-button nk-button_theme_islands nk-button_size_l nk-close-window" type="button">
                      <span class="nk-button__text" data-i18n="remindLater"></span>
                    </button>
                    <button class="nk-button nk-button_theme_islands nk-button_size_l nk-button_view_action nk-button_hovered nk-form-submit-view__submit nk-close-window" type="button">
                      <a class="nk-button__text" style="text-decoration: none;color: inherit;" href="https://github.com/Dmitry-407/nmap/releases/latest" target="_blank" data-i18n="goToGithub"></a>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`);
      applyTranslations(); // Apply translations to newly added elements

      $(".nk-close-window").on("click", () => {
        const winodw = $(".nk-window-update .nk-modal.nk-modal_theme_islands");
        winodw.removeClass("nk-modal_visible");

        setTimeout(() => {
          winodw.remove()
        }, 3000);
      });
    }
  });

  const getExpertise = (publicID) => {
    const config = window.appChrome.config;

    const data = [
      {
        "method": "social/getUserExpertise",
        "params": {
          "userPublicId": publicID,
          "token": JSON.parse(localStorage.getItem("nk:token"))
        }
      }
    ];

    $.ajax({
      type: "POST",
      headers: {
        'content-type': 'text/plain;charset=UTF-8',
        'x-kl-ajax-request': 'Ajax_Request',
        'x-csrf-token': config.api.csrfToken,
        'x-lang': 'ru'
      },
      url: window.location.origin + config.api.url + "/batch",
      dataType: "json",
      data: JSON.stringify(data),
      success: function (response) {
        user.expertise = response.data[0].data;
        window.appChrome.user = user;
      }
    });
  };

  const getStartStatus = () => {
    const config = window.appChrome.config;

    const data = [
      {
        "method": "app/getCurrentUser",
        "params": {
          "token": JSON.parse(localStorage.getItem("nk:token"))
        }
      },
      {
        "method": "app/getCategoriesConfig",
        "params": {
          "token": JSON.parse(localStorage.getItem("nk:token"))
        }
      }
    ];

    $.ajax({
      type: "POST",
      headers: {
        'x-kl-ajax-request': 'Ajax_Request',
        'x-csrf-token': config.api.csrfToken,
        'x-lang': 'ru'
      },
      url: window.location.origin + config.api.url + "/batch",
      dataType: "json",
      data: JSON.stringify(data),
      success: function (response) {
        user = response.data[0].data;
        window.appChrome.configGet = response.data[1].data;

        getExpertise(user.publicId);

        startStatus = user.yandex || user.outsourcer || user.moderationStatus === "moderator";

        window.appChrome.user = user;
        window.appChrome.startStatus = startStatus;

        if (checkUpdate) {
          chrome.runtime.sendMessage({method: "checkUpdate", id: user.id}, function (response) {
            update = response;
          });

          checkUpdate = false;
        }
      }
    });

    setTimeout(getStartStatus, 30000);
  };

  $.ajax({
    url: window.location.origin,
    type: "GET",
    success: function(data) {
      const response = new DOMParser().parseFromString(data, "text/html");
      const config = JSON.parse(response.getElementById("config").innerHTML);

      window.appChrome.config = config;
      loadMap.observe(appPage[0], {childList: true});

      if (JSON.parse(localStorage.getItem("nk:token"))) {
        getStartStatus();
      }
    }
  });

  const getStatusCategory = (data) => {
    let cat_name = '&mdash;'; // This seems like a default dash, might not need translation or use a generic one
    let status_code = data.status_code ? data.status_code.toLowerCase() : '';
    let info_center = "";

    let color = status_code == 'processing' ? 'orange' :
      status_code == 'finished' ? 'green-light' :
        status_code == 'old' ? 'green' :
          status_code == 'confirmed' ? 'red' :
            status_code == 'kvartal' ? 'kvartal' :
              status_code == 'start' ? 'red' : '';

    if (data.status_code === 'PROCESSING') {
      cat_name = chrome.i18n.getMessage("newHouse");
      data.status_text = chrome.i18n.getMessage("underConstruction");
    }
    if (data.status_code === 'FINISHED') {
      cat_name = chrome.i18n.getMessage("newHouse");
      data.status_text = chrome.i18n.getMessage("commissioned");
    }
    if (data.status_code === 'START') {
      cat_name = chrome.i18n.getMessage("newHouse");
      data.status_text = chrome.i18n.getMessage("startingPlatform");
    }
    if (data.status_code === 'KVARTAL') {
      cat_name = chrome.i18n.getMessage("newHouse");
      data.status_text = chrome.i18n.getMessage("quarterDevelopmentObjects");
    }

    if (data.status_code === 'OLD') {
      cat_name = chrome.i18n.getMessage("houseInRenovationProgram");

      if (data.ext_status === 'settling') {
        data.status_text = chrome.i18n.getMessage("resettlementInProgress");
      } else if (data.ext_status === 'settled') {
        data.status_text = chrome.i18n.getMessage("resettlementCompleted");
      } else if (data.ext_status === 'destroyed') {
        data.status_text = chrome.i18n.getMessage("resettlementCompletedHouseDemolished");
      } else {
        data.status_text = chrome.i18n.getMessage("resettlementNotStarted");
      }

      // data.status = 'Введен в эксплуатацию'; // This was hardcoded, seems to be a fixed status for 'OLD' category
      data.status = chrome.i18n.getMessage("commissioned");


      if (data.ext_status == 'settling') {
        if (data.infocenter) {
          info_center = chrome.i18n.getMessage("resettlementAtInfoCenter") + data.infocenter.name + (data.infocenter2 ? '\n' + data.infocenter2.name : '');
        }else {
          info_center = chrome.i18n.getMessage("infoCenterClosedContactPrefecture");
        }
      }else if (data.ext_status == 'settled') {
        info_center = chrome.i18n.getMessage("resettlementCompleted");
      }else if (data.ext_status == 'destroyed') {
        info_center = chrome.i18n.getMessage("resettlementCompletedHouseDemolished");
      }else {
        info_center = chrome.i18n.getMessage("resettlementNotStartedInfoCenterAddressLater");
      }
    }

    return {
      color: color,
      status: data.status,
      status_text: data.status_text,
      cat_name: cat_name,
      info_center: info_center
    };
  };

  ////////////////////

  window.appChrome = {
    init: {},
    notification: null,
    // text: text, // Removed text object
    user: user,
    startStatus: startStatus,
    configGet: {},
    config: {},
    creatElement: creatElement,
    popupShow: popupShow,
    triggerClick: triggerClick,
    simulateClickByPoint: simulateClickByPoint,
    getStatusCategory: getStatusCategory
  };

  window.needNotification = {
    status: false
  };
})();
