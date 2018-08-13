using System;

namespace ScreenReservation {
	class Program {
		static void Main(string[] argv) {
			APPBARDATA abd = new APPBARDATA() { hWnd = IntPtr.Zero };
			string action = argv[0];
			abd.hWnd = new IntPtr(Convert.ToInt32(argv[1], 10));
			switch(action) {
				case "ADD":
					abd.uCallbackMessage = Native.RegisterWindowMessage("ScreenReservation");
					Native.SHAppBarMessage(ABMsg.NEW, ref abd);
					break;
				case "REMOVE":
					Native.SHAppBarMessage(ABMsg.REMOVE, ref abd);
					break;
				case "QUERY":
					abd.uEdge = Enum.Parse(ABEdge, argv[6]);
					abd.rc = new RECT(Convert.ToInt32(argv[2]),Convert.ToInt32(argv[3]),Convert.ToInt32(argv[4]),Convert.ToInt32(argv[5]));
					Native.SHAppBarMessage(ABMsg.QUERYPOS, ref abd);
					break;
				case "SET":
					abd.uEdge = Enum.Parse(ABEdge, argv[6]);
					abd.rc = new RECT(Convert.ToInt32(argv[2]),Convert.ToInt32(argv[3]),Convert.ToInt32(argv[4]),Convert.ToInt32(argv[5]));
					Native.SHAppBarMessage(ABMsg.SETPOS, ref abd);
					// Native.MoveWindow(abd.hWnd, abd.rc.Left, abd.rc.Right, abd.rc.Width, abd.rc.Height, true);
					break;
			}
			Console.WriteLine("{");
			Console.WriteLine("\"cbSize\": {0},", abd.cbSize);
	        Console.WriteLine("\"hWnd\": {0},", abd.hWnd);
	        Console.WriteLine("\"uCallbackMessage\": {0},", abd.uCallbackMessage);
	        Console.WriteLine("\"uEdge\": \"{0}\",", abd.uEdge);
	        Console.WriteLine("\"lParam\": {0},", abd.lParam);
	        Console.WriteLine("\"rc\": {{ \"left\": {0}, \"top\": {1}, \"right\": {2}, \"bottom\": {3} }}", abd.rc.Left, abd.rc.Top, abd.rc.Right, abd.rc.Bottom);
	        Console.WriteLine("}");
		}

	}
}