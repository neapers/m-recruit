!(function($) {
    $.fn.includeFeed = function(options) {
        return $(this).each(function() {
            var fillElement = this;
            var settings = $.extend(true, {}, $.fn.includeFeed.defaults, options);
            $(fillElement).html("");
            if ("string" == typeof settings.baseSettings.rssURL) {
                settings.baseSettings.rssURL = [settings.baseSettings.rssURL];
            }
            for (var i = 0; i < settings.baseSettings.rssURL.length;
                ++i) {
                $.ajax({
                    type: "GET",
                    url: settings.baseSettings.rssURL,
                    dataType: "xml",
                    error: function(request, type, errorThrown) {
                        $(fillElement).html("<div>An error occurred. Please try again later. " + errorThrown + "</div>");
                        return;
                    },
                    success: function(xml) {
                        var outputText = "";
                        var repeatTag = settings.baseSettings.repeatTag;
                        xml = $(xml);
                        if (settings.baseSettings.rssURL[0].indexOf('job/') > -1 || settings.baseSettings.rssURL[0].indexOf('?nocategories=true') > -1) {
                            xml.find('refinelist').remove();
                        }
                        xml.find(repeatTag).each(function(itemIndex) {
                            var xmlElement = $(this);
                            if (itemIndex != 0 && settings.baseSettings.limit <= itemIndex) return;
                            var itemText = settings.templates.itemTemplate;
                            itemText = itemText.replace(/{{item-index}}/g, itemIndex);
                            itemText = replaceShortCodes("[[", "]]", itemText, xmlElement, settings.templates, settings.predicates, false);
                            itemText = replaceShortCodes("{{", "}}", itemText, xmlElement, settings.templates, settings.predicates, settings.baseSettings.addNBSP);
                            
                            var location = xmlElement.find('category').find('location').find('value').text()
                            if (location)
                            	itemText = itemText.replace(/<\/span>[\n\s\t]*<\/li>$/, '<div class="xmlLocation"><span><strong>' + location + '</strong></span></div></span></li>')

                            outputText += itemText;
                        });
                        $(fillElement).append(outputText);
                        settings.complete.call(fillElement);
                    }
                });
            }
        });
    };

    //<div class="xmlLocation"><span class='xmlboldtitle'><strong>Sydney</strong></span class='xmlboldtitle'></div>

    function replaceShortCodes(startCode, endCode, itemText, xmlElement, templateArray, predicateArray, addNBSP) {
        for (var startPosition = itemText.indexOf(startCode); startPosition != -1; startPosition = itemText.indexOf(startCode)) {
            var endPosition = itemText.indexOf(endCode);
            var propertyName = itemText.substr(startPosition + startCode.length, endPosition - startPosition - endCode.length);
            var propertyValue = templateArray[propertyName] || xmlElement.find(propertyName).text();
            if (predicateArray[propertyName]) {
                propertyValue = predicateArray[propertyName](propertyValue);
            }
            if (addNBSP) {
                propertyValue = propertyValue.slice(0, propertyValue.lastIndexOf(" ")) + propertyValue.slice(propertyValue.lastIndexOf(" ")).replace(" ", "&nbsp;");
            }
            itemText = itemText.replace(startCode + propertyName + endCode, propertyValue);
        }
        return itemText;
    }
    $.fn.includeFeed.defaults = {
        baseSettings: { rssURL: "/job/rss.aspx", limit: 10, descriptionLimit: 200, addNBSP: true, repeatTag: "item" },
        templates: { itemTemplate: "<li class='rss-item' id='rss-item-{{item-index}}'><span class='rss-item-title'><a target='_blank' href='{{link}}'>{{title}}</a></span><span class='rss-item-pubDate'>[[pubDateTemplate]]</span><span class='rss-item-description'>{{description}}</span></li>", pubDateTemplate: "{{pubDate}}" },
        predicates: {
            pubDate: function(pubDate) {
                var monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                var dateObj = '';
                var myDay, myMonth, myYear;
                dateObj = pubDate.split('/');
                mnth = monthList[parseInt(dateObj[1]) - 1];
                myDay = "<span class='rss-item-pubDate-date'>" + dateObj[0] + "</span> ";
                myMonth = "<span class='rss-item-pubDate-month'>" + mnth + "</span> ";
                myYear = "<span class='rss-item-pubDate-full-year'>" + dateObj[2].substr(0, 4) + "</span> ";
                return myDay + myMonth + myYear;
            }
        },
        complete: function() {}
    }
})(jQuery);