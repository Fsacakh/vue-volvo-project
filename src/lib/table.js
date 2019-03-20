/** 
  Table Config
**/
export default {

    init: function() {
        $('.rightDiv2').scroll(function(e) {
            var left = $(".rightDiv2").scrollLeft();
            var top = $(".rightDiv2").scrollTop();
            $('.leftDiv2').scrollTop(top);
            $('.rightDiv1').scrollLeft(left);
        })
    }
}