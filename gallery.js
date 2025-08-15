
    // Initialize Masonry after all images have loaded
    var $grid = $('.grid').imagesLoaded( function() {
      $grid.masonry({
        itemSelector: '.grid-item',
        percentPosition: true,
      });
    });


