import { NavLink } from "react-router-dom";

import { sidebarMenu } from "./sidebarMenu";

import { getRole } from "../../utils/auth";

import API from "../../services/api";

import {
  useEffect,
  useState,
} from "react";

import "./Sidebar.css";

export default function Sidebar() {
  const role = getRole();

  const [hasPretest, setHasPretest] =
    useState(false);

  useEffect(() => {
    checkPretest();
  }, []);

  const checkPretest = async () => {
    try {
      const res = await API.get(
        "/pretest/check"
      );

      setHasPretest(
        res.data.hasPretest
      );

    } catch (err) {
      console.error(err);
    }
  };

  const menus = sidebarMenu[role] || [];

  // HIDE PRETEST MENU
  const filteredMenus = menus.filter(
    (menu) => {

      // jika student sudah pretest
      // hide menu pretest
      if (
        role === 3 &&
        hasPretest &&
        menu.path ===
          "/student/pretest"
      ) {
        return false;
      }

      return true;
    }
  );

  const isDisabled = (menu) => {
    if (role !== 3) return false;

    // sebelum pretest:
    // hanya Dashboard & Pretest aktif
    if (!hasPretest) {
      return ![
        "/student/dashboard",
        "/student/pretest",
      ].includes(menu.path);
    }

    return false;
  };

  return (
    <div className="sidebar">

      {/* LOGO */}
      <div className="sidebar-logo">

        <img
          src="/images/logo/daesan_orange_logo.png"
          alt="Daesan Logo"
        />

        <p>daesan</p>

      </div>

      <hr className="sidebar-divider" />

      {/* MENU */}
      <div className="sidebar-menu">

        {filteredMenus.map((menu) => {
          const disabled =
            isDisabled(menu);

          return (
            <NavLink
              key={menu.path}
              to={
                disabled
                  ? "#"
                  : menu.path
              }
              className={({
                isActive,
              }) =>
                `
                sidebar-link
                ${
                  isActive &&
                  !disabled
                    ? "active"
                    : ""
                }
                ${
                  disabled
                    ? "disabled"
                    : ""
                }
                `
              }
              style={{
                pointerEvents:
                  disabled
                    ? "none"
                    : "auto",

                cursor:
                  disabled
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {menu.name}
            </NavLink>
          );
        })}

      </div>

    </div>
  );
}