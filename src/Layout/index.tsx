import { Outlet } from "react-router-dom";
import { ScrollToTop, Sidebar, Topbar } from "@/components/Layout";
import { MenuIcon } from "@/components/common";
import { useFadeIn, useOutClick } from "@/hooks";

const Layout = () => {
  const menu = useOutClick<HTMLDivElement, HTMLDivElement>();

  const scrollToTopView = useFadeIn<HTMLDivElement>();
  
  return (
        <div className="min-h-[100vh] overflow-y-auto w-full">
          <div
            className="absolute h-1/2 invisible opacity-0 w-px"
            ref={scrollToTopView.ref}
            style={{ visibility: "collapse", zIndex: -150 }}
          />
          <header className="bg-gray-100 flex items-center justify-between px-4 py-3 md:px-6 md:py-4 lg:hidden">
            <div className="h-[30px] w-[130px]">
              <img className="h-full w-full" src="/static/images/logo.jpg" title="kite" />
            </div>
            <MenuIcon
              color="primary"
              ref={menu.buttonRef}
              setVisible={menu.setVisible}
              visible={menu.visible}
            />
          </header>
          <div className="h-full flex relative">
            <Sidebar
              setVisible={menu.setVisible}
              visible={menu.visible}
              ref={menu.ref}
            />

            <main className="min-h-[75vh] w-full lg:ml-auto lg:w-5/6">
              <Topbar />
              <Outlet />
              <ScrollToTop
                onClick={() => window.scroll(0, 0)}
                visible={scrollToTopView.visible}
              />
            </main>
          </div>
        </div>
  );
};

Layout.defaultProps = {
  is_admin: true
}

export default Layout;
