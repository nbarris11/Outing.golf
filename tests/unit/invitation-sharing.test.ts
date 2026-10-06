import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PostCreateBanner } from "@/components/outings/post-create-banner";
import { buildOutingInviteCopy } from "@/lib/outing-invite-copy";

const { trackFunnel } = vi.hoisted(() => ({ trackFunnel: vi.fn() }));
vi.mock("@/lib/analytics/funnel-client", () => ({ trackFunnel }));
vi.mock("@/lib/actions/outings", () => ({ inviteMemberAction: vi.fn() }));
const link = "https://www.outing.golf/join/private-token";
const props = { shareLink: link, outingName: "Fall golf", destination: "Pinehurst, NC", analytics: { outingId: "outing-1", actorId: "organizer-1", actorRole: "organizer" as const, excluded: false } };
const copy = buildOutingInviteCopy(props.outingName, props.destination, link);

describe("invitation sharing", () => {
  beforeEach(() => { vi.stubGlobal("React", React); trackFunnel.mockReset(); });
  afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
  it("includes trip, destination, clear ask, and exactly one link", () => {
    expect(copy.withLink).toBe(`You're invited to Fall golf — Pinehurst, NC. Add your dates and budget so we can get this trip booked.\n\n${link}`);
    expect(buildOutingInviteCopy("Golf", " ", link).message).not.toContain("—");
  });
  it("copies the whole message separately from the bare link", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    render(React.createElement(PostCreateBanner, props));
    fireEvent.click(screen.getByRole("button", { name: "Copy invite message" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(copy.withLink));
    expect(trackFunnel).toHaveBeenCalledWith("outing_share_action", props.analytics, { method: "copy_message", placement: "organizer_banner" });
    fireEvent.click(screen.getByRole("button", { name: "Copy link" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(link));
  });
  it("does not report failed clipboard writes as shares", async () => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: vi.fn().mockRejectedValue(Error("denied")) } });
    render(React.createElement(PostCreateBanner, props));
    fireEvent.click(screen.getByRole("button", { name: "Copy link" }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Select the invite link"));
    expect(trackFunnel).not.toHaveBeenCalled();
  });
  it("falls back to copying the full message when native sharing is unavailable", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "share", { configurable: true, value: undefined });
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    render(React.createElement(PostCreateBanner, props));
    fireEvent.click(screen.getByRole("button", { name: "Share with friends" }));
    await waitFor(() => expect(trackFunnel).toHaveBeenCalledWith("outing_share_action", props.analytics, { method: "copy_message", placement: "organizer_banner" }));
    expect(writeText).toHaveBeenCalledWith(copy.withLink);
  });
  it("uses consistent text and email content without claiming delivery", () => {
    render(React.createElement(PostCreateBanner, props));
    expect(screen.getByRole("link", { name: "Share by text" })).toHaveAttribute("href", `sms:?body=${encodeURIComponent(copy.withLink)}`);
    expect(screen.getByRole("link", { name: "Share by email" })).toHaveAttribute("href", `mailto:?subject=${encodeURIComponent(copy.title)}&body=${encodeURIComponent(copy.withLink)}`);
  });
  it("offers a personal email invite beside the first share prompt", () => {
    render(React.createElement(PostCreateBanner, { ...props, canInviteByEmail: true, notice: { message: "Invite email sent", type: "success" } }));
    expect(screen.getByRole("textbox", { name: "Or invite a golfer by email" })).toHaveAttribute("type", "email");
    expect(screen.getByRole("button", { name: "Send invite" })).toBeInTheDocument();
    expect(screen.getByText("Invite email sent")).toBeInTheDocument();
  });
  it("shares structured native text and does not count cancellation", async () => {
    const share = vi.fn().mockRejectedValueOnce(new DOMException("Cancelled", "AbortError")).mockResolvedValue(undefined);
    Object.defineProperty(navigator, "share", { configurable: true, value: share });
    render(React.createElement(PostCreateBanner, props));
    fireEvent.click(screen.getByRole("button", { name: "Share with friends" }));
    await waitFor(() => expect(share).toHaveBeenCalledTimes(1));
    expect(trackFunnel).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Share with friends" }));
    await waitFor(() => expect(trackFunnel).toHaveBeenCalledWith("outing_share_action", props.analytics, { method: "native_share", placement: "organizer_banner" }));
    expect(share).toHaveBeenLastCalledWith({ title: copy.title, text: copy.message, url: link });
  });
});
