$(document).ready(function(){

  // Faster scrolling via http://thecssninja.com/javascript/pointer-events-60fps
  var body = document.body, timer;
  window.addEventListener('scroll', function(){
    clearTimeout(timer);
    if(!body.classList.contains('disable-hover'))
      body.classList.add('disable-hover')
    timer = setTimeout(function(){
      body.classList.remove('disable-hover')
    }, 500);
  }, false);

  // Animate each `#home>.hero>p` iteratively
  $('.reveal').addClass('is-visible');

  // Format dates
  var moments = [];
  $('.moment').each(function(i, obj){
    var time = $(obj).data('time');
    var format = $(obj).data('format');
    if(typeof format === 'undefined') {
      if(moment(time) >= moment().subtract(1, 'days')) {
        format = 'ha [today]'
      } else if(moment(time) >= moment().subtract('days', 2)) {
        format = 'ha [yesterday]'
      } else if(moment(time) >= moment().subtract('days', 7)) {
        format = '[last] dddd';
      } else {
        format = 'MMM D, YYYY';
      }
    }
    var pretty = moment(time).format(format);
    moments.push({'object': obj, 'pretty': pretty});
  });
  _.each(moments, function(m){
    $(m['object']).html(m['pretty']);
  });

});