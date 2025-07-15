
document.addEventListener('DOMContentLoaded', function() {
   
    window.toggleSidebar = function() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    };

    window.closeSidebar = function() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    };

    window.toggleSubmenu = function(element) {
        const item = element.parentElement;
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.item.active').forEach(activeItem => {
            if (activeItem !== item) activeItem.classList.remove('active');
        });
        item.classList.toggle('active');
        if (!isActive) {
            const submenuItems = item.querySelectorAll('.submenu .item');
            submenuItems.forEach((submenuItem, index) => {
                setTimeout(() => {
                    submenuItem.classList.add('slide-in');
                }, index * 50);
            });
        }
    };

    window.goBack = function(element) {
        const item = element.closest('.item');
        item.classList.remove('active');
    };

    
    const sidebarSearchInput = document.getElementById('sidebarSearchInput');
    if (sidebarSearchInput) {
        sidebarSearchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const menuItems = document.querySelectorAll('.menu-items .item');
            menuItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

  
    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('sidebar');
        const toggle = document.querySelector('.sidebar-toggle');
        const overlay = document.getElementById('sidebarOverlay');
        if (sidebar && !sidebar.contains(e.target) && e.target !== toggle && e.target !== overlay) {
            closeSidebar();
        }
    });
});
