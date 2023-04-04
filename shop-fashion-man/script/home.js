$(()=> {
  // intit swiper
  let swiper;

  // Swiper break points
  const updateSlidesPerView=(n)=>{
    swiper = new Swiper(".SwiperSetting", {
      slidesPerView: n,
      spaceBetween: 30,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      }
    });
  };

  // Responsive slider
  const checkSlidesWidth=()=> {
    let width = $(window).width();
    if(width > 800){
      updateSlidesPerView(4);
    } else if (width< 800 && width> 600) {
      updateSlidesPerView(3);
    }else if (width < 600 && width > 500) {
      updateSlidesPerView(2);
    }else if(width < 500 ){
      updateSlidesPerView(1);
    }else {
      updateSlidesPerView(4);
    }
  };
  checkSlidesWidth();

  // Window resize observer
  window.addEventListener('resize', (e) => {
    checkSlidesWidth();
  });
  
  // Append new arrival and best selling items
  const star ="<i class='bx bxs-star'></i>";
  $.getJSON('./script/products.json',function(data){
    $.each(data,function(i,items){

      // New Arrival items
      const newArrvialItems = [];
      newArrvialItems.push(items.accessories[0]);
      newArrvialItems.push(items.accessories[1]);
      newArrvialItems.push(items.bottoms[0]);
      newArrvialItems.push(items.bottoms[1]);
      newArrvialItems.push(items.shoes[0]);
      newArrvialItems.push(items.shoes[1]);
      newArrvialItems.push(items.tops[0]);
      newArrvialItems.push(items.tops[1]);

      newArrvialItems.forEach((item, i) => {
        $('#newArrivalContainer').append(
          `<div class="swiper-slide"> 
          <div class="row p-0 m-0"> 
            <img class="px-0" src="./images/products/${item.id}.webp" alt="new arrival items"> 
            <div class="px-0 newItemName bold d-inline-block  text-truncate">
              <a class="newItemName text-decoration-none link-secondary" href="./pages/shops/productDetails.html?product_id=${item.id}">${(item.itemName).replace(/_/g," ")}</a>
            </div>
            <div class="px-0" id="stars">${star}${star}${star}${star}${star}</div>
            <div class="px-0 newItemPrice">$${item.price}</div>
          </div>  
          </div>`
        );
      });
    
      // Best selling items
      const bestSellingItems = [];
      bestSellingItems.push(items.tops[11]);
      bestSellingItems.push(items.tops[10]);
      bestSellingItems.push(items.tops[4]);

      // Sale items
      const saleItems = [];
      saleItems.push(items.tops[5]);
      saleItems.push(items.bottoms[10]);
      saleItems.push(items.shoes[4]);

      // Append items function
      const getItems= (data, categories) => {
        data.forEach(item => {
          $(`#${categories}`).append(
            `<div class="row">
              <div class="col-4 pl-0">
                <img class="w-100 p-2 bestSellingImg" src="./images/products/${item.id}.webp" alt="sale items">
              </div>
              <div class="col-8 feature-text">
                  <p>
                    <a class="text-decoration-none textColorWhite link-secondary" href="./pages/shops/productDetails.html?product_id=${item.id}">${(item.itemName).replace(/_/g," ")}</a>
                  </p>
                  <div>${star}${star}${star}${star}${star}</div>
                  <div class="feature-price mt-3">
                    <span id="feature-item-price">$${(item.price + 20).toFixed(2)}</span>
                    <span id="feature-item-price-cutPrice">$${item.price}</span>
                  </div>
              </div>
            </div>`
          );
        });
      };
      getItems(bestSellingItems, "onSale_items");
      getItems(saleItems, "bestSelling_items");
    });
  });

  // Append models
  for(let i = 0; i < 6; i++) {
    $('#models').append(
      `<div class="model">   
        <img src="./images/models/m${i+1}.jpg" alt="model${i+1}">
      </div>`
    )
  }
});