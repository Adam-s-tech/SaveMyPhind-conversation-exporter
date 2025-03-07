import {handleModalDisplay} from "./uiEnhancer/modals/actions/displayCtaModals";
import {setLoadListener} from "./window/setLoadListener";
import {detectPageLoad} from "./detectPageLoad";
import {launchScrapping} from "./scraper/scrapPage";
import {EXPORT_DOMAINS, LOAD_DOMAINS} from "../../data/allowedDomains.json";
import {domainChecker} from "../shared/checker/domainChecker";
import {getHostAndPath} from "./utils/getters";
import {getStorageData} from "../shared/utils/chromeStorage";
import {safeExecute} from "../shared/utils/jsShorteners";

async function tab() {
  const isInjecting = await getStorageData('isInjecting', 'local');
  isInjecting
    ? await actionExtensionIconClicked()
    : await actionPageLoaded();
  await chrome.storage.local.set({isInjecting: false});
}

export async function actionPageLoaded() {
  const domain = domainChecker(LOAD_DOMAINS, getHostAndPath());
  if (domain === null) return;
  const htmlCheck = detectPageLoad(domain);
  if (!htmlCheck) return;
  // scrapOnLoadListener();
  await setLoadListener(domain);
}

export async function actionExtensionIconClicked() {
  const domainPage = domainChecker(EXPORT_DOMAINS, getHostAndPath());
  if (domainPage === null) return;
  launchScrapping(domainPage); // don't safeExecute because we don't want handleModalDisplay to increment count
  await safeExecute(handleModalDisplay());
}

safeExecute(tab());
