(function($){function generateOption(text,link)
{return"<option value='"+link+"'>"+text+"</option>"}
$.fn.convertNavigation=function(options)
{var dropDown=$("<select class='navigation'></select>");dropDown.append(generateOption(options["title"],"/"));var myLinks=options["links"];if("string"==typeof myLinks)
{myLinks=$(options["links"]);}
else
{myLinks=options["links"];}
myLinks.not("[data-ignore=true]").not(options["excludeFromList"]).each(function(){dropDown.append(generateOption($(this).text(),$(this).attr("href")));});dropDown.children("option:first").attr("selected",true);dropDown.children("option").each(function(){if(location.pathname!="/"&&$(this).attr("value")==location.pathname)
{$(this).attr("disabled",true);}});if($(this).children("select.navigation").length)
{$(this).children("select.navigation").remove();}
$(this).append(dropDown);$(this).children("select.navigation").on("change",function(){location.href=$(this).val();});}})(jQuery);(function($){function generateOption(obj)
{var optBegin="<option";var optMid=">"+$(obj).text();var optEnd="</option>";if(obj.attributes&&obj.attributes.length)
{$.each(obj.attributes,function(){optBegin+=" "+"data-"+this.name+"=\""+this.value+"\"";});}
else
{$(obj).find("a").each(function(){if(this.attributes&&this.attributes.length)
{$.each(this.attributes,function(){optBegin+=" "+"data-"+this.name+"=\""+this.value+"\"";});}});}
return optBegin+optMid+optEnd;}
$.fn.convertButtons=function(options)
{var dropDown=$("<select style='position:absolute;top:0;left:0;z-index:1;width:100%;height:100%;opacity:0;cursor:pointer;'></select>");dropDown.append(generateOption($("<option>"+options["title"]+"</option>")));dropDown.children("option:first").attr("selected",true);$(options["links"]).not("[data-ignore=true]").each(function(){dropDown.append(generateOption(this));});if($(this).children(".actions-button select").length)
{$(this).children(".actions-button select").remove();}
$(this).append("<div class='button actions-button' style='position: relative;'></div>");$(this).children(".actions-button").append(dropDown);$(this).children(".actions-button").append("<a href='javascript:void(0);'>"+options["buttonTitle"]+"</a>");$(this).find(".actions-button select").on("change",function(){eval($(this).find("option:selected").attr("data-onclick"));if($(this).find("option:selected").attr("data-href").length)
{location.href=$(this).find("option:selected").attr("data-href");}});}})(jQuery);(function($){function generateOptGroup(label)
{return"<optgroup label='"+label+"'></optgroup>";}
function generateOption(obj){var optBegin="<option";var optMid=">"+$(obj).text();var optEnd="</option>";if(obj.attributes&&obj.attributes.length){$.each(obj.attributes,function(){optBegin+=" "+"data-"+this.name+"=\""+this.value+"\"";});}else{$(obj).find("a").each(function(){if(this.attributes&&this.attributes.length){$.each(this.attributes,function(){if(this.value.indexOf('ItemtoRemove')>-1){optBegin+=" "+this.name+"=\""+this.value+"\"";}else{optBegin+=" "+"data-"+this.name+"=\""+this.value+"\"";}});}});}
return optBegin+optMid+optEnd;}
$.fn.convertFilters=function(options)
{var dropDown=$("<select style='position:absolute;top:0;left:0;z-index:1;width:100%;height:100%;opacity:0;cursor:pointer;'></select>");dropDown.append(generateOption($("<a>"+options["title"]+"</a>")));dropDown.children("option:first").attr("selected",true);if($(options["filtered"]).length)
{dropDown.append(generateOptGroup(options["filteredTitle"]));$(options["filtered"]).each(function(){dropDown.children("optgroup:last").append(generateOption(this));});}
$(options["list"]).find("> li").not(options["excludeFromList"]).each(function(){if($(this).children("a").length&&$(this).children("ul").length)
{dropDown.append(generateOptGroup($(this).children("a").text()));$(this).find("> ul > li > a").each(function(){var currentLink=this;dropDown.children("optgroup:last").append(generateOption(this));});}});if($(this).children(".filters-button select").length)
{$(this).children(".filters-button select").remove();}
$(this).append("<div class='button filters-button' style='position: relative;'></div>");$(this).children(".filters-button").append(dropDown);$(this).children(".filters-button").append("<a href='javascript:void(0);'>"+options["buttonTitle"]+"</a>");$(this).find(".filters-button select").on("change",function(){eval($(this).find("option:selected").attr("onclick"));if($(this).find("option:selected").attr("data-href").length)
{location.href=$(this).find("option:selected").attr("data-href");}});}})(jQuery);