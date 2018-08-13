using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Text;
using System.Runtime.InteropServices;
// using System.Diagnostics;
// using System.ComponentModel;

namespace ScreenReservation
{
    public class Native
    {
        [DllImport("user32.dll")]
        [return: MarshalAs(UnmanagedType.Bool)]
        public static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter, int X, int Y, int cx, int cy, int uFlags);

        [DllImport("shell32.dll")]
        public static extern IntPtr SHAppBarMessage(ABMsg dwMessage, ref APPBARDATA pData);

        [DllImport("User32.dll", ExactSpelling = true,
            CharSet = System.Runtime.InteropServices.CharSet.Auto)]
        public static extern bool MoveWindow(IntPtr hWnd, int x, int y, int cx, int cy, bool repaint);

        [DllImport("User32.dll", CharSet = CharSet.Auto)]
        public static extern uint RegisterWindowMessage(string msg);
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct APPBARDATA
    {
        //  typedef struct _AppBarData
        //      {
        //        DWORD cbSize;
        //        HWND hWnd;
        //        UINT uCallbackMessage;
        //        UINT uEdge;
        //        RECT rc;
        //        LPARAM lParam;
        //      } APPBARDATA, *PAPPBARDATA;
        public int cbSize;
        public IntPtr hWnd;
        public uint uCallbackMessage;
        public ABEdge uEdge;
        public RECT rc;
        public int lParam;
    }

    public enum ABMsg : uint
    {
        NEW = 0,
        REMOVE,
        QUERYPOS,
        SETPOS,
        GETSTATE,
        GETTASKBARPOS,
        ACTIVATE,
        GETAUTOHIDEBAR,
        SETAUTOHIDEBAR,
        WINDOWPOSCHANGED,
        SETSTATE
    }
    public enum ABNotify : uint
    {
        STATECHANGE = 0,
        POSCHANGED,
        FULLSCREENAPP,
        WINDOWARRANGE
    }
    public enum ABEdge : int
    {
        LEFT = 0,
        TOP,
        RIGHT,
        BOTTOM
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct RECT
    {
        public int Left, Top, Right, Bottom;

        public RECT(int left, int top, int right, int bottom)
        {
            Left = left;
            Top = top;
            Right = right;
            Bottom = bottom;
        }

        public int X
        {
            get { return Left; }
            set { Right -= (Left - value); Left = value; }
        }

        public int Y
        {
            get { return Top; }
            set { Bottom -= (Top - value); Top = value; }
        }

        public int Height
        {
            get { return Bottom - Top; }
            set { Bottom = value + Top; }
        }

        public int Width
        {
            get { return Right - Left; }
            set { Right = value + Left; }
        }

        public static bool operator ==(RECT r1, RECT r2)
        {
            return r1.Equals(r2);
        }

        public static bool operator !=(RECT r1, RECT r2)
        {
            return !r1.Equals(r2);
        }

        public override int GetHashCode()
        {
            return (this.Left % 256) + ((this.Right % 256) << 8) + ((this.Top % 256) << 16) + ((this.Bottom % 256) * 24);
        }

        public bool Equals(RECT r)
        {
            return r.Left == Left && r.Top == Top && r.Right == Right && r.Bottom == Bottom;
        }

        public override bool Equals(object obj)
        {
            if (obj is RECT)
                return Equals((RECT)obj);
            return false;
        }

        public override string ToString()
        {
            return string.Format(System.Globalization.CultureInfo.CurrentCulture, "{{Left={0},Top={1},Right={2},Bottom={3}}}", Left, Top, Right, Bottom);
        }
    }
}
