jQuery(document).ready(function(a){a(".frm_ajax_loading").css("visibility","hidden");a(document).on("click",".frm_trigger",frmToggleSection);a(".frm_blank_field").length&&a(".frm_blank_field").closest(".frm_toggle_container").prev(".frm_trigger").click();a.isFunction(a.fn.placeholder)?a(".frm-show-form input, .frm-show-form textarea").placeholder():jQuery(".frm-show-form input[onblur], .frm-show-form textarea[onblur]").each(function(){""===jQuery(this).val()&&jQuery(this).blur()});a(document).on("click",
'.frm-show-form input[name^="item_meta"][type="radio"], .frm-show-form input[name^="item_meta"][type="checkbox"]',frmMaybeCheckDependent);a(document).on("change",'.frm-show-form input[name^="item_meta"]:not([type=radio], [type=checkbox]), .frm-show-form select[name^="item_meta"], .frm-show-form textarea[name^="item_meta"]',frmMaybeCheckDependent);a(document).on("click",'.frm-show-form input[type="submit"], .frm-show-form input[name="frm_prev_page"], .frm-show-form .frm_save_draft',frmSetNextPage);
a(document).on("click",".frm_remove_link",frmRemoveDiv)});
function frmSetNextPage(a){"submit"!=jQuery(this).attr("type")&&a.preventDefault();a=jQuery(this).parents("form:first");var c="",e="";if("frm_prev_page"==jQuery(this).attr("name")||jQuery(this).hasClass("frm_prev_page"))c=jQuery(a).find(".frm_next_page").attr("id").replace("frm_next_p_","");else if("frm_save_draft"==jQuery(this).attr("name")||jQuery(this).hasClass("frm_save_draft"))e=1;jQuery(".frm_next_page").val(c);jQuery(".frm_saving_draft").val(e);"submit"!=jQuery(this).attr("type")&&a.trigger("submit")}
function frmToggleSection(){jQuery(this).next(".frm_toggle_container").slideToggle("fast");jQuery(this).toggleClass("active").children(".ui-icon-triangle-1-e, .ui-icon-triangle-1-s").toggleClass("ui-icon-triangle-1-s ui-icon-triangle-1-e")}function frmClearDefault(a,c){var e=a.replace(/(\n|\r\n)/g,"\r");jQuery(c).val().replace(/(\n|\r\n)/g,"\r")==e&&jQuery(c).removeClass("frm_default").val("")}
function frmReplaceDefault(a,c){var e=a.replace(/(\n|\r\n)/g,"\r");""===jQuery(c).val()&&jQuery(c).addClass("frm_default").val(e)}function frmMaybeCheckDependent(){var a=jQuery(this).attr("name").replace("item_meta[","").split("]")[0];a&&frmCheckDependent("und",a)}
function frmCheckDependent(a,c,e){if("undefined"!=typeof __FRMRULES){var f=__FRMRULES[c];if("undefined"!=typeof f){if("undefined"==typeof e||null===e)e="go";for(var d=[],k=0;k<f.length;k++){var l=f[k];if("undefined"!=typeof l)for(var g=0;g<l.Conditions.length;g++){var m=l.Conditions[g];m.HideField=l.Setting.FieldName;m.MatchType=l.MatchType;m.Show=l.Show;d.push(m)}}for(var h=[],n=[],p=d.length,k=0;k<p;k++)(function(f){var b=d[f];"undefined"==typeof h[b.HideField]&&(h[b.HideField]=[]);if(b.FieldName!=
c||"undefined"==typeof a||"und"==a){var k=a;"radio"==b.Type||"data-radio"==b.Type?a=jQuery("input[name='item_meta["+b.FieldName+"]']:checked, input[type='hidden'][name='item_meta["+b.FieldName+"]']").val():"select"==b.Type||"data-select"==b.Type?(a=jQuery("select[name^='item_meta["+b.FieldName+"]'], input[type='hidden'][name^='item_meta["+b.FieldName+"]']").val(),jQuery("input[type='hidden'][name^='item_meta["+b.FieldName+"]']").length&&(a=[],jQuery("input[type='hidden'][name^='item_meta["+b.FieldName+
"]']").each(function(){a.push(jQuery(this).val())}))):"checkbox"!=b.Type&&"data-checkbox"!=b.Type&&(a=jQuery("input[name^='item_meta["+b.FieldName+"]']").val())}"undefined"==typeof a&&(a=jQuery("input[type=hidden][name^='item_meta["+b.FieldName+"]']").val(),"undefined"==typeof a&&(a=""));if("checkbox"==b.Type||"data-checkbox"==b.Type&&"undefined"==typeof b.LinkedField)h[b.HideField][f]=!1,jQuery("input[name='item_meta["+b.FieldName+"][]']:checked, input[type='hidden'][name^='item_meta["+b.FieldName+
"]']").each(function(){var a=frmOperators(b.Condition,b.Value,jQuery(this).val());!1===h[b.HideField][f]&&a&&(h[b.HideField][f]=!0)});else if("data-radio"==b.Type)"undefined"==typeof b.DataType||""===b.DataType||"data"===b.DataType?""===a?(h[b.HideField][f]=!1,jQuery("#frm_field_"+b.HideField+"_container").fadeOut("slow"),jQuery("#frm_data_field_"+b.HideField+"_container").html("")):h[b.HideField][f]="undefined"==typeof b.DataType?frmOperators(b.Condition,b.Value,a):{funcName:"frmGetData",f:b,sel:a}:
h[b.HideField][f]=""===a?!1:{funcName:"frmGetDataOpts",f:b,sel:a};else if("data-checkbox"==b.Type&&"undefined"!=typeof b.LinkedField){var g=[];jQuery("input[name='item_meta["+b.FieldName+"][]']:checked, input[type='hidden'][name='item_meta["+b.FieldName+"][]']").each(function(){g.push(jQuery(this).val())});"undefined"==typeof b.DataType||""===b.DataType||"data"===b.DataType?g.length?(h[b.HideField][f]=!0,jQuery("#frm_data_field_"+b.HideField+"_container").html(""),frmGetData(b,g,1)):(h[b.HideField][f]=
!1,jQuery("#frm_field_"+b.HideField+"_container").fadeOut("slow"),jQuery("#frm_data_field_"+b.HideField+"_container").html("")):h[b.HideField][f]=g.length?{funcName:"frmGetDataOpts",f:b,sel:g}:!1}else"data-select"==b.Type&&"undefined"!=typeof b.LinkedField?""===b.DataType||"data"==b.DataType?""===a?(h[b.HideField][f]=!1,jQuery("#frm_data_field_"+b.HideField+"_container").html("")):a&&jQuery.isArray(a)?(h[b.HideField][f]=!0,jQuery("#frm_data_field_"+b.HideField+"_container").html(""),frmGetData(b,
a,1)):h[b.HideField][f]={funcName:"frmGetData",f:b,sel:a}:h[b.HideField][f]=""===a?!1:{funcName:"frmGetDataOpts",f:b,sel:a}:"undefined"==typeof b.Value&&0===b.Type.indexOf("data")?(b.Value=""===a?"1":a,h[b.HideField][f]=frmOperators(b.Condition,b.Value,a),b.Value=void 0):h[b.HideField][f]=frmOperators(b.Condition,b.Value,a);b.FieldName!=c&&(a=k);"any"==b.MatchType?!1!==h[b.HideField][f]?"show"==b.Show?!0!==h[b.HideField][f]?frmShowField(h[b.HideField][f],b.FieldName,e):jQuery("#frm_field_"+b.HideField+
"_container").show():jQuery("#frm_field_"+b.HideField+"_container").hide():n.push({result:h[b.HideField][f],show:b.Show,match:"any",fname:b.FieldName,fkey:b.HideField}):"all"==b.MatchType&&n.push({result:h[b.HideField][f],show:b.Show,match:"all",fname:b.FieldName,fkey:b.HideField});f==p-1&&jQuery.each(n,function(a,b){"undefined"!=typeof b&&"undefined"!=typeof b.result&&("any"==b.match&&-1==jQuery.inArray(!0,h[b.fkey])||"all"==b.match&&-1<jQuery.inArray(!1,h[b.fkey])?"show"==b.show?(jQuery("#frm_field_"+
b.fkey+"_container:hidden").hide(),jQuery("#frm_field_"+b.fkey+"_container").hide()):jQuery("#frm_field_"+b.fkey+"_container").show():"show"==b.show?jQuery("#frm_field_"+b.fkey+"_container").show():(jQuery("#frm_field_"+b.fkey+"_container:hidden").hide(),jQuery("#frm_field_"+b.fkey+"_container").hide()),!1!==typeof b.result&&!0!==typeof b.result&&frmShowField(b.result,b.fname,e),delete n[a])})})(k)}}}
function frmOperators(a,c,e){"undefined"==typeof e&&(e="");jQuery.isArray(e)&&-1<jQuery.inArray(c,e)&&(e=c);-1!=String(c).search(/^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/)&&(c=parseFloat(c),e=parseFloat(e));return"-1"!=String(c).indexOf("&quot;")&&frmOperators(a,c.replace("&quot;",'"'),e)?!0:{"==":function(a,d){return a==d},"!=":function(a,d){return a!=d},"<":function(a,d){return a>d},">":function(a,d){return a<d},LIKE:function(a,d){return d?-1!=d.indexOf(a):0},"not LIKE":function(a,d){return d?-1==
d.indexOf(a):1}}[a](c,e)}function frmShowField(a,c,e){"frmGetDataOpts"==a.funcName?frmGetDataOpts(a.f,a.sel,c,e):"frmGetData"==a.funcName&&frmGetData(a.f,a.sel,0)}
function frmGetData(a,c,e){e||jQuery("#frm_data_field_"+a.HideField+"_container").html('<span class="frm-loading-img"></span>');jQuery.ajax({type:"POST",url:frm_js.ajax_url,data:"action=frm_fields_ajax_get_data&entry_id="+c+"&field_id="+a.LinkedField+"&current_field="+a.HideField,success:function(f){""!==f&&jQuery("#frm_field_"+a.HideField+"_container").show();if(e)jQuery("#frm_data_field_"+a.HideField+"_container").append(f);else{jQuery("#frm_data_field_"+a.HideField+"_container").html(f);var d=
jQuery("#frm_data_field_"+a.HideField+"_container").children("input").val();""!==f&&""!==d||jQuery("#frm_field_"+a.HideField+"_container").hide();frmCheckDependent(c,a.HideField)}return!0}})}
function frmGetDataOpts(a,c,e,f){"undefined"==typeof frm_checked_dep&&(frm_checked_dep=[]);if(!("stop"==f&&-1<jQuery.inArray(a.HideField,frm_checked_dep)&&jQuery("input[type='hidden'][name^='item_meta["+e+"]']").length)){var d=[];if("checkbox"==a.DataType||"radio"==a.DataType)jQuery("input[name^='item_meta["+a.HideField+"]']:checked, input[type='hidden'][name^='item_meta["+a.HideField+"]']").each(function(){d.push(jQuery(this).val())});else if("select"==a.DataType)if(jQuery("input[type='hidden'][name^='item_meta["+
a.HideField+"]']").length)jQuery("input[type='hidden'][name^='item_meta["+a.HideField+"]']").each(function(){d.push(jQuery(this).val())});else if(jQuery("select[name^='item_meta["+a.HideField+"]']").length)d=jQuery("select[name^='item_meta["+a.HideField+"]']").val();else{if(("stop"==f||jQuery("#frm_data_field_"+a.HideField+"_container .frm-loading-img").length)&&-1<jQuery.inArray(a.HideField,frm_checked_dep))return}else d.push(jQuery("input[name^='item_meta["+a.HideField+"]']").val());if(null===d||
0===d.length)d="";frm_checked_dep.push(a.HideField);if(!jQuery("#frm_data_field_"+a.HideField+"_container").length&&jQuery("input[type='hidden'][name^='item_meta["+a.HideField+"]']").length)return frmCheckDependent(d,a.HideField,"stop"),!1;jQuery("#frm_data_field_"+a.HideField+"_container").html('<span class="frm-loading-img" style="visibility:visible;display:inline;"></span>');jQuery.ajax({type:"POST",url:frm_js.ajax_url,data:"action=frm_fields_ajax_data_options&hide_field="+e+"&entry_id="+c+"&selected_field_id="+
a.LinkedField+"&field_id="+a.HideField,success:function(c){""===c?(jQuery("#frm_field_"+a.HideField+"_container").hide(),d=""):"all"!=a.MatchType&&jQuery("#frm_field_"+a.HideField+"_container").show();jQuery("#frm_data_field_"+a.HideField+"_container").html(c);if(""!==c&&""!==d){if(!jQuery.isArray(d)){var e=[];e.push(d);d=e}jQuery.each(d,function(c,e){"undefined"!=typeof e&&("checkbox"==a.DataType||"radio"==a.DataType?jQuery("#field_"+a.HideField+"-"+e).attr("checked","checked"):"select"==a.DataType?
jQuery("select[name^='item_meta["+a.HideField+"]'] option[value="+e+"]").length?jQuery("select[name^='item_meta["+a.HideField+"]'] option[value="+e+"]").prop("selected",!0):d.splice(c,1):jQuery("input[name^='item_meta["+a.HideField+"]']").val(e))})}jQuery(c).hasClass("frm_chzn")&&jQuery().chosen&&jQuery(".frm_chzn").chosen({allow_single_deselect:!0});frmCheckDependent(d,a.HideField,"stop")}})}}
function frmOnSubmit(a){a.preventDefault();jQuery(this).find(".wp-editor-wrap").length&&"undefined"!=typeof tinyMCE&&tinyMCE.triggerSave();frmGetFormErrors(this)}
function frmGetFormErrors(a){jQuery(a).find('input[type="submit"], input[type="button"]').attr("disabled","disabled");jQuery(a).find(".frm_ajax_loading").css("visibility","visible");frm_checked_dep=[];var c="",e=0,f=0;jQuery.ajax({type:"POST",url:frm_js.ajax_url,data:jQuery(a).serialize()+"&action=frm_entries_"+jQuery(a).find('input[name="frm_action"]').val()+"&_ajax_nonce=1",success:function(d){d=d.replace(/^\s+|\s+$/g,"");0===d.indexOf("{")&&(d=jQuery.parseJSON(d));if(""===d||!d||"0"===d||"object"!=
typeof d&&0===d.indexOf("<!DOCTYPE"))jQuery("#frm_loading").length&&(d=jQuery(a).find("input[type=file]").val(),"undefined"!=typeof d&&""!==d&&setTimeout(function(){jQuery("#frm_loading").fadeIn("slow")},2E3)),jQuery(a).find("#recaptcha_area").length&&(1>jQuery(a).find(".frm_next_page").length||1>jQuery(a).find(".frm_next_page").val())&&jQuery(a).find("#recaptcha_area").replaceWith(""),a.submit();else if("object"!=typeof d){jQuery(a).find(".frm_ajax_loading").css("visibility","hidden");c=jQuery(a).closest("#frm_form_"+
jQuery(a).find('input[name="form_id"]').val()+"_container");e=c.offset().top;c.replaceWith(d);f=document.documentElement.scrollTop||document.body.scrollTop;e&&e>frm_js.offset&&f>e&&jQuery(window).scrollTop(e-frm_js.offset);if("function"==typeof frmThemeOverride_frmAfterSubmit){var k=jQuery(d).find('input[name="form_id"]').val(),l="";k&&(l=jQuery('input[name="frm_page_order_'+k+'"]').val());frmThemeOverride_frmAfterSubmit(k,l,d,a)}jQuery(a).find('input[name="id"]').length&&(d=jQuery(a).find('input[name="id"]').val(),
jQuery("#frm_edit_"+d).find("a").addClass("frm_ajax_edited").click())}else{jQuery(a).find('input[type="submit"], input[type="button"]').removeAttr("disabled");jQuery(a).find(".frm_ajax_loading").css("visibility","hidden");k=!0;jQuery(".form-field").removeClass("frm_blank_field");jQuery(".form-field .frm_error").replaceWith("");c="";var l=!1,g;for(g in d)if(jQuery(a).find("#frm_field_"+g+"_container").length&&jQuery("#frm_field_"+g+"_container").is(":visible"))k=!1,""===c&&(frmScrollMsg(g,a),c="#frm_field_"+
g+"_container"),jQuery(a).find("#frm_field_"+g+"_container #recaptcha_area").length&&(l=!0,Recaptcha.reload()),jQuery(a).find("#frm_field_"+g+"_container").addClass("frm_blank_field"),"function"==typeof frmThemeOverride_frmPlaceError?frmThemeOverride_frmPlaceError(g,d):jQuery(a).find("#frm_field_"+g+"_container").append('<div class="frm_error">'+d[g]+"</div>");else if("redirect"==g){window.location=d[g];return}!0!==l&&jQuery(a).find("#recaptcha_area").replaceWith("");k&&a.submit()}},error:function(){jQuery(a).find('input[type="submit"], input[type="button"]').removeAttr("disabled");
a.submit()}})}
function frmEditEntry(a,c,e,f,d,k){var l=jQuery("#frm_edit_"+a).html(),g=jQuery("#"+c+a).html();jQuery("#"+c+a).html('<span class="frm-loading-img" id="'+c+a+'"></span><div class="frm_orig_content" style="display:none">'+g+"</div>");jQuery.ajax({type:"POST",url:frm_js.ajax_url,dataType:"html",data:"action=frm_entries_edit_entry_ajax&post_id="+e+"&entry_id="+a+"&id="+f,success:function(g){jQuery("#"+c+a).children(".frm-loading-img").replaceWith(g);jQuery("#frm_edit_"+a).replaceWith('<span id="frm_edit_'+a+
'"><a onclick="frmCancelEdit('+a+",'"+c+"','"+frm_escape_html(l)+"',"+e+","+f+",'"+k+'\')" class="'+k+'">'+d+"</a></span>")}})}
function frmCancelEdit(a,c,e,f,d,k){var l=jQuery("#frm_edit_"+a+" a").html();jQuery("#frm_edit_"+a).find("a").hasClass("frm_ajax_edited")||(jQuery("#"+c+a).children(".frm_forms").replaceWith(""),jQuery("#"+c+a).children(".frm_orig_content").fadeIn("slow").removeClass("frm_orig_content"));jQuery("#frm_edit_"+a).replaceWith('<a id="frm_edit_'+a+'" class="frm_edit_link '+k+'" href="javascript:frmEditEntry('+a+",'"+c+"',"+f+","+d+",'"+frm_escape_html(l)+"','"+k+"')\">"+e+"</a>")}
function frmUpdateField(a,c,e,f,d){jQuery("#frm_update_field_"+a+"_"+c).html('<span class="frm-loading-img"></span>');jQuery.ajax({type:"POST",url:frm_js.ajax_url,data:"action=frm_entries_update_field_ajax&entry_id="+a+"&field_id="+c+"&value="+e,success:function(){""===f.replace(/^\s+|\s+$/g,"")?jQuery("#frm_update_field_"+a+"_"+c+"_"+d).fadeOut("slow"):jQuery("#frm_update_field_"+a+"_"+c+"_"+d).replaceWith(f)}})}
function frmDeleteEntry(a,c){jQuery("#frm_delete_"+a).replaceWith('<span class="frm-loading-img" id="frm_delete_'+a+'"></span>');jQuery.ajax({type:"POST",url:frm_js.ajax_url,data:"action=frm_entries_destroy&entry="+a,success:function(e){"success"==e.replace(/^\s+|\s+$/g,"")?jQuery("#"+c+a).fadeOut("slow"):jQuery("#frm_delete_"+a).replaceWith(e)}})}function frmRemoveDiv(){jQuery(this).parent(".frm_uploaded_files").fadeOut("slow").replaceWith("")}
function frmNextUpload(a,c){a.wrap('<div class="frm_file_names frm_uploaded_files">');for(var e=a.get(0).files,f=0;f<e.length;f++)1==e.length?a.after(e[f].name+' <a href="#" onclick="frmClearFile(jQuery(this));return false;">'+frm_js.remove+"</a>"):a.after(e[f].name+"<br/>");a.hide();jQuery("#frm_field_"+c+"_container .frm_uploaded_files:last").after('<input name="file'+c+'[]" multiple="multiple" type="file" onchange="frmNextUpload(jQuery(this),'+c+')"/>')}
function frmClearFile(a){a.parent(".frm_file_names").replaceWith("");return!1}function frm_resend_email(a,c){jQuery("#frm_resend_email").replaceWith('<img id="frm_resend_email" src="'+frm_js.images_url+'/wpspin_light.gif" alt="'+frm_js.loading+'" />');jQuery.ajax({type:"POST",url:frm_js.ajax_url,data:"action=frm_entries_send_email&entry_id="+a+"&form_id="+c+"&type=email",success:function(a){jQuery("#frm_resend_email").replaceWith(a)}})}
function frmScrollMsg(a,c){var e="undefined"==typeof c?jQuery("#frm_form_"+a+"_container").offset().top:jQuery(c).find("#frm_field_"+a+"_container").offset().top;if(e){var e=e-frm_js.offset,f=jQuery("html").css("margin-top"),d=jQuery("body").css("margin-top");if(f||d)e=e-parseInt(f)-parseInt(d);cOff=document.documentElement.scrollTop||document.body.scrollTop;e&&(!cOff||cOff>e)&&jQuery(window).scrollTop(e)}}
function frm_escape_html(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}jQuery.fn.frmVisible=function(){return this.css("visibility","visible")};jQuery.fn.frmInvisible=function(){return this.css("visibility","hidden")};jQuery.fn.frmVisibilityToggle=function(){return this.css("visibility",function(a,c){return"visible"==c?"hidden":"visible"})};