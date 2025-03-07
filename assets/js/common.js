const getAuthUser = () => {
  const authUser = localStorage.getItem('authUser'); // data // null
  if (authUser !== null) {
    return JSON.parse(authUser);
  }
  return null;
};

const authUser = getAuthUser();
const isAdmin = authUser?.user?.isAdmin;

console.log(
  authUser, "authUser"
)

const themCheckboxMethod = () => {
  document.body.classList.toggle("dark-mode");
  const topBar = document.querySelector("#custom-top-bar nav");
  const sidebar = document.querySelector("#custom-sidebar aside");
  if (document.body.className.includes("dark-mode")) {
    topBar.classList.remove("navbar-light");
    topBar.classList.add("navbar-dark");
    sidebar.classList.add("sidebar-dark-primary");
    sidebar.classList.remove("sidebar-light-primary");
  } else {
    topBar.classList.remove("navbar-dark");
    topBar.classList.add("navbar-light");
    sidebar.classList.remove("sidebar-dark-primary");
    sidebar.classList.add("sidebar-light-primary");
  }
  localStorage.setItem(
    "theme",
    document.body.className.includes("dark-mode") ? "dark" : "light"
  );
};

const loadTheme = () => {
  const theme = localStorage.getItem("theme");
  const themeToggle = document.getElementById("theme-toggle");
  const topBar = document.querySelector("#custom-top-bar nav");
  const sidebar = document.querySelector("#custom-sidebar aside");

  if (theme === "light") {
    themeToggle.removeAttribute("checked");
    document.body.classList.remove("dark-mode");
    topBar.classList.remove("navbar-dark");
    topBar.classList.add("navbar-light");
    sidebar.classList.remove("sidebar-dark-primary");
    sidebar.classList.add("sidebar-light-primary");
  } else {
    themeToggle.setAttribute("checked", "true");
    document.body.classList.add("dark-mode");
    topBar.classList.remove("navbar-light");
    topBar.classList.add("navbar-dark");
    sidebar.classList.add("sidebar-dark-primary");
    sidebar.classList.remove("sidebar-light-primary");
  }
};

const pages = [
  {
    url: "/index.html",
    name: "Dashboard",
  },
  {
    url: "#",
    isNavGroup: true,
    name: "Staff",
    navItems: [
      {
        url: "/pages/hospital/Doctor.html",
        name: "Doctor",
      },
      {
        url: "/pages/hospital/Receptionist.html",
        name: "Receptionist",
        isAdminPage: true,
      },
    ],
  },
  {
    url: "/pages/hospital/Patients.html",
    name: "Patients",
    isAdminPage: true,
  },
  {
    url: "/pages/hospital/PatientsProfile.html",
    name: "Patients",
    isShow: false,
    isAdminPage: true,
  },
  {
    url: "/pages/hospital/Appointments.html",
    name: "Appointments",
  },
  {
    url: "/pages/hospital/Settings.html",
    name: "Settings",
  },
  {
    url: "#",
    name: "Logout",
  },
];

const changeActiveSidebarMenu = () => {
  const currentUrl = window.location.href;

  // undefined if not found
  let currentPage = pages.find((el) => {
    return (
      currentUrl.includes(el.url) ||
      (el.isNavGroup &&
        el.navItems.find((navItem) => currentUrl.includes(navItem.url)))
    );
  });

  if (currentPage && currentPage.isNavGroup) {
    currentPage = {
      ...currentPage.navItems.find((navItem) =>
        currentUrl.includes(navItem.url)
      ),
      isNavGroup: true,
    };
  }

  const navItems = document.querySelectorAll("#nav-items .nav-item");

  navItems.forEach((liElement) => {
    const AElement = liElement.querySelector("a");
    const liPElement = liElement.querySelector("a p");

    console.log("liAElement.innerHTML", liPElement.textContent.trim());
    if (liPElement.textContent.trim().includes(currentPage.name)) {
      AElement.classList.add("active");
      AElement.setAttribute("href", "#");
      if (currentPage.isNavGroup) {
        const navTreeView = document.getElementById("nav-treeview");
        navTreeView.style.display = "block";
      }
    }
  });

  // console.log("currentPage", currentPage);
};

const addNestedNavItems = (page) => {
  const navItems = page.navItems
    .map((navItem) => {
      if (navItem.isAdminPage && !isAdmin) {
        return "";
      }
      return `
          <li class="nav-item">
                    <a href="${navItem.url}" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>${navItem.name}</p>
                    </a>
                  </li>
        `;
    })
    .join("");
  return navItems;
};

const addNavItems = () => {
  const navItems = document.querySelector("#nav-items");

  pages.forEach((page) => {
    if (page.isAdminPage && !isAdmin) {
      return;
    }
    if (page.name === 'Logout') {
      navItems.innerHTML+= `
         <li class="nav-item">
                      <a href="${page.url}" class="nav-link" onclick="logout()">
                        <p>${page.name}</p>
                      </a>
           </li>
      `
    } else {
      if (page.isNavGroup) {
        navItems.innerHTML += `
                   <li class="nav-item">
                  <a href="${page.url}" class="nav-link">
                    <p>
                      ${page.name}
                      <i class="right fas fa-angle-left"></i>
                    </p>
                  </a>
                  <ul class="nav nav-treeview" id="nav-treeview">
                   ${addNestedNavItems(page)}
                  </ul>
          </li>
              `;
      } else {
        if (page.isShow !== false) {
          navItems.innerHTML += `
                      <li class="nav-item">
                        <a href="${page.url}" class="nav-link">
                          <p>${page.name}</p>
                        </a>
             </li>
                      `;
        }
      }
    }
  });
};

const initSidebar = () => {
  const customSidebar = document.getElementById("custom-sidebar");
  if (customSidebar) {
    customSidebar.innerHTML = "";
    customSidebar.innerHTML = `
             <aside class="main-sidebar sidebar-dark-primary elevation-4">
        <a href="../../index.html" class="brand-link">
          <img
            src="https://yt3.googleusercontent.com/evmN0xSKACBzWoOuZUWwIl7wbRZteMoxuy3dGXoHnUfTlgR4o1OdijFSmZrqG6J6e0Ilp1K2sHE=s900-c-k-c0x00ffffff-no-rj"
            alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style="opacity: .8" alt="AdminLTE Logo"
            class="brand-image img-circle elevation-3" style="opacity: .8">
          <span class="brand-text font-weight-light">Al Shifa</span>
        </a>
  
        <div class="sidebar">
          <div class="user-panel mt-3 pb-3 mb-3 d-flex">
            <div class="image">
              <img src="../../dist/img/Myimage.jpg" class="img-circle elevation-2" alt="User Image">
            </div>
            <div class="info">
              <a href="#" class="d-block">Mudassir Ali Khan</a>
            </div>
          </div>
          <nav class="mt-2">
            <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false" id="nav-items">
  
            </ul>   
          </nav>
        </div>
      </aside>
        `;
    addNavItems();
    changeActiveSidebarMenu();
  }
};

const initnavBar = () => {
  const customNavBar = document.getElementById("custom-top-bar")
  if (customNavBar) {
    customNavBar.innerHTML = "";
    customNavBar.innerHTML = `
            <nav class="main-header navbar navbar-expand navbar-dark">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
        </li>
      </ul>

      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <label class="ui-switch mt-2">
            <input type="checkbox" id="theme-toggle" onchange="themCheckboxMethod()" checked>
            <div class="slider">
              <div class="circle"></div>
            </div>
          </label>
        </li>

        <li class="nav-item">
          <a class="nav-link" data-widget="fullscreen" href="#" role="button">
            <i class="fas fa-expand-arrows-alt"></i>
          </a>
        </li>
      </ul>
    </nav>
    `
  }
}

initnavBar();
initSidebar();
loadTheme();
