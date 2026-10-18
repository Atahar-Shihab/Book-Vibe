// LocalStorage management for Book Vibe reading lists, streak, and notes
import { playSuccessChime } from "./audio";

const READ_LIST_KEY = "bookvibe_read_list";
const WISHLIST_KEY = "bookvibe_wishlist";
const NOTES_KEY = "bookvibe_notes";
const STREAK_KEY = "bookvibe_reading_streak";

export function getStoredReadList() {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(READ_LIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load read list from localStorage", e);
    return [];
  }
}

export function addToReadList(book, showToast) {
  const currentList = getStoredReadList();
  const exists = currentList.find((b) => Number(b.bookId) === Number(book.bookId));

  if (exists) {
    if (showToast) {
      showToast(`"${book.bookName}" is already marked as Read!`, "info");
    }
    return { success: false, reason: "already_read" };
  }

  const updated = [...currentList, { ...book, readAt: new Date().toISOString() }];
  localStorage.setItem(READ_LIST_KEY, JSON.stringify(updated));

  // If in wishlist, optionally we can keep or note it
  playSuccessChime();
  updateReadingStreak();

  if (showToast) {
    showToast(`🎉 Bravo! "${book.bookName}" added to Read Books!`, "success");
  }
  return { success: true };
}

export function removeFromReadList(bookId, showToast) {
  const currentList = getStoredReadList();
  const updated = currentList.filter((b) => Number(b.bookId) !== Number(bookId));
  localStorage.setItem(READ_LIST_KEY, JSON.stringify(updated));
  if (showToast) {
    showToast("Book removed from Read list", "info");
  }
  return updated;
}

export function getStoredWishlist() {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(WISHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load wishlist from localStorage", e);
    return [];
  }
}

export function addToWishlist(book, showToast) {
  const readList = getStoredReadList();
  const isAlreadyRead = readList.some((b) => Number(b.bookId) === Number(book.bookId));

  if (isAlreadyRead) {
    if (showToast) {
      showToast(`You have already completed "${book.bookName}", so it cannot be added to Wishlist!`, "warning");
    }
    return { success: false, reason: "already_read" };
  }

  const currentWishlist = getStoredWishlist();
  const existsInWishlist = currentWishlist.some((b) => Number(b.bookId) === Number(book.bookId));

  if (existsInWishlist) {
    if (showToast) {
      showToast(`"${book.bookName}" is already in your Wishlist!`, "info");
    }
    return { success: false, reason: "already_wishlist" };
  }

  const updated = [...currentWishlist, { ...book, addedAt: new Date().toISOString() }];
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
  playSuccessChime();

  if (showToast) {
    showToast(`✨ "${book.bookName}" saved to your Wishlist!`, "success");
  }
  return { success: true };
}

export function removeFromWishlist(bookId, showToast) {
  const currentList = getStoredWishlist();
  const updated = currentList.filter((b) => Number(b.bookId) !== Number(bookId));
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
  if (showToast) {
    showToast("Book removed from Wishlist", "info");
  }
  return updated;
}

// User Personal Notes per Book
export function getBookNotes(bookId) {
  if (typeof window === "undefined") return "";
  try {
    const allNotes = JSON.parse(localStorage.getItem(NOTES_KEY) || "{}");
    return allNotes[bookId] || "";
  } catch {
    return "";
  }
}

export function saveBookNote(bookId, note, showToast) {
  try {
    const allNotes = JSON.parse(localStorage.getItem(NOTES_KEY) || "{}");
    allNotes[bookId] = note;
    localStorage.setItem(NOTES_KEY, JSON.stringify(allNotes));
    if (showToast) {
      showToast("💾 Personal thoughts saved safely!", "success");
    }
  } catch (e) {
    console.error("Save note error:", e);
  }
}

// Reading Streak tracker
export function getReadingStreak() {
  if (typeof window === "undefined") return { count: 3, lastDate: new Date().toISOString() };
  try {
    const data = localStorage.getItem(STREAK_KEY);
    if (!data) {
      // Default initial motivational streak for student
      const initial = { count: 4, lastDate: new Date().toISOString() };
      localStorage.setItem(STREAK_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  } catch {
    return { count: 4, lastDate: new Date().toISOString() };
  }
}

export function updateReadingStreak() {
  const current = getReadingStreak();
  const today = new Date().toDateString();
  const last = new Date(current.lastDate).toDateString();

  if (today !== last) {
    const nextCount = current.count + 1;
    const updated = { count: nextCount, lastDate: new Date().toISOString() };
    localStorage.setItem(STREAK_KEY, JSON.stringify(updated));
    return updated;
  }
  return current;
}
