if (typeof browser === "undefined") {
    var browser = chrome;
}

const referralConfigs = [
    {
        domain: "bol.com",
        exclude: [],
        param: "Referrer=ADVNLPPcef594008952a38b00000000000f0020577"
    },
    {
        domain: "amazon.nl",
        exclude: [],
        param: "tag=depositumcust-21"
    },
    {
        domain: "coolblue.nl",
        exclude: ["melding-sluiten"],
        param: "ref=293530"
    }
];

browser.webNavigation.onBeforeNavigate.addListener(details => {
    const url = new URL(details.url);

    for (const config of referralConfigs) {
        if (url.hostname.includes(config.domain)) {
            // If the referral param is already present, do nothing to avoid loops
            if (url.href.includes(config.param)) return;

            // If is found inside the exclude list, do nothing to make the site function properly
            for (const exclusion of config.exclude) {
                if (url.href.includes(config.domain) && url.href.includes(exclusion)) return;
            }

            // Append the referral param correctly with ? or &
            const separator = url.search.length > 0 ? "&" : "?";
            const newUrl = url.href + separator + config.param;

            // Redirect the tab to the new URL with referral params
            browser.tabs.update(details.tabId, { url: newUrl });
            return; // Stop processing after redirecting
        }
    }
}, {
    url: referralConfigs.map(c => ({ hostSuffix: c.domain }))
});

