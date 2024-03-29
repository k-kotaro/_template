import "@babel/polyfill";

// jquery
import $ from "jquery";

// common
import '../common/entry';

const pageList = () => {
  $.getJSON("dev/include/pagelist.json", function(pagelist){
    let page = [], colspanVal, blancCellVal, colspan, blancCell;

    for(let i in pagelist){
      if(pagelist[i].SSID){
        page.push(pagelist[i].dirLevel);
      }
    }
    let maxDirLevel = Math.max.apply(null, page);

    for(let i in pagelist){
      if(pagelist[i].SSID){
        colspanVal = maxDirLevel - pagelist[i].dirLevel + 1;
        blancCellVal = maxDirLevel - colspanVal;
        colspan = (colspanVal > 1)? '<td colspan="'+ colspanVal +'">' : '<td>';
        blancCell = (blancCellVal > 0)? '<td>&nbsp;</td>\n\r'.repeat(blancCellVal) : '';

        let h = '<tr>\n\r<th>'+ pagelist[i].SSID +'</th>\n\r'
        + blancCell
        + colspan + pagelist[i].pageName +'</td>\n\r'
        + '<td><a href="'+ pagelist[i].pageUrl +'" target="_blank">'+ pagelist[i].pageUrl +'</td>\n\r</tr>\n\r';
        $("table.jsonPagelist > tbody").append(h);
      }
    }
  });
};

$(() => {
  pageList();
});
