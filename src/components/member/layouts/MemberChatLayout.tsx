// src/components/member/layouts/MemberChatLayout.tsx
//
// Messages.tsx and HubChannel.tsx are built on an `h-full` chain (see
// their own comments: "only the message list scrolls, not the page") -
// that only works if some ancestor commits to a *definite* height the
// chain can resolve percentages against. The regular DashboardLayout
// only sets `min-h-screen` on its root, which is a floor, not a definite
// size: once a conversation's content is taller than one viewport, the
// whole page's height becomes auto/content-driven instead, `h-full`
// resolves to nothing definite, and the "only the message list scrolls"
// design silently stops working - the composer and header just scroll
// away with the rest of the page instead of staying pinned, and the
// internal `overflow-y-auto` on the message list never actually engages
// because it never gets a bounded box to overflow within. This isn't
// something a screenshot at any single scroll position would show - it
// only appears once there's enough chat history to matter.
//
// AdminChatLayout.tsx already solves exactly this for the admin chat
// routes (h-screen/overflow-hidden on the outer shell, min-h-0 down the
// chain, row-flex so the content column stretches to fill it). This
// mirrors that same fix for the member side while keeping
// DashboardLayout's own chrome and spacing (Sidebar + Topbar + the mt-6
// gap under the skip link) intact, so nothing about the page's
// appearance changes outside the height mechanics - only /messages,
// /messages/:id and /hub-channel use this instead of DashboardLayout.
//
// h-dvh, not h-screen: 100vh on a phone is measured against the
// *largest* possible viewport, so with the browser's address bar visible
// it overshoots the actually-visible area - combined with the
// overflow-hidden this layout needs, that can clip the composer below
// the fold until the chrome auto-hides. 100dvh tracks the real visible
// viewport instead. Supported everywhere relevant since 2022
// (Safari 15.4+, Chrome/Edge 108+, Firefox 101+).

import React from "react";
import { Sidebar } from "../Sidebar";
import { Topbar } from "../Topbar";
import SkipToContent from "../../SkipToContent";

export const MemberChatLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex flex-col h-dvh overflow-hidden bg-mist-100">
      <SkipToContent />

      {/* min-h-0: without it, this row's default min-height:auto would
          let it grow to fit the chat's content instead of being capped
          at the space the h-dvh root actually has to give it. */}
      <div className="flex flex-1 min-h-0 mt-6">
        <Sidebar />

        {/* min-w-0 (don't force the row to overflow), min-h-0 (same
            shrink-to-fit fix as above, one level down: this column's
            height comes from stretching to fill the row above, but
            without min-h-0 its own content would still be able to push
            it taller than that). */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <Topbar />
          <main
            id="main-content"
            className="flex-1 min-h-0 px-4 sm:px-10 py-6 flex flex-col overflow-hidden"
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MemberChatLayout;
