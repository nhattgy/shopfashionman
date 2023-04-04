$(()=> {
    // Toogle menu
    let mobileMenu = $( ".navlinks");
    $( "#mobile-menu" ).on( "click", ()=> {
        mobileMenu.slideToggle();   
    }); 
    
    // Display number of item in cart
    let itemCount = $('.count');
    localStorage.getItem('itemCount') ? itemCount.text( localStorage.getItem('itemCount')): itemCount.text(0);
});