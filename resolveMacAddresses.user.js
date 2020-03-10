// ==UserScript==
// @name         Resolve MAC Addresses for TD-W8970 v1 web pages
// @namespace    https://github.com/Neurone/hus
// @version      1.0
// @description  Resolve MAC Addresses based on settings in Wireless MAC Filtering page. Tested on TD-W8970 v1 Firmware Version:0.6.0 2.12 v000c.0 Build 140613 Rel.31066n
// @author       Giuseppe Bertone <bertone.giuseppe@gmail.com>
// @match        http://192.168.1.1
// @grant        none
// @supportURL   https://github.com/Neurone/hus/issues
// @copyright    2020, MIT
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

(function () {
    'use strict';

    const REFRESH_RATE = 400; //milliseconds
    let macNames = {};

    function isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    var checkPage = function () {
        let pageName = jQuery("#et").text();
        if ('Wireless Stations Status' === pageName) {
            if (isEmpty(macNames)) {
                jQuery("#t_info").html("This page displays the basic information of all stations in this wireless network. <span style='color:red;font-weight:bold'>To init the MAC address resolution please visit the 'Wireless MAC filtering' page at least once.</span>");
            } else {
                // Resolve MAC names
                jQuery("#staTbl tr").each(function () {
                    let cell = jQuery(this).find("td:eq(1)");
                    let macAddress = cell.text();
                    cell.text(macNames[macAddress]);
                });
            }
        } else if ('Wireless MAC Filtering settings' === pageName) {
            // Update MAC name list
            macNames = {};
            jQuery("#macTbl tr").each(function () {
                let macAddress = jQuery(this).find("td:eq(1)").text();
                let macName = jQuery(this).find("td:eq(3)").text();
                macNames[macAddress] = macName;
            });
            // Save MAC names in local storage
            if (typeof (Storage) !== "undefined")
                localStorage.macNames = JSON.stringify(macNames);
        }
    };

    $.noConflict();
    jQuery.when(jQuery.ready).then(function () {
        // Retrieve saved MAC list
        if (typeof (Storage) !== "undefined" && localStorage.macNames)
            macNames = JSON.parse(localStorage.macNames);
        setInterval(checkPage, REFRESH_RATE);
    });

})();
