//   <div className="flex items-center justify-between">
//     <h1 className="text-2xl font-semibold tracking-tight">
//       Hello {session.data?.user?.name || "person"}!
//     </h1>
//     {session.data ? (
//       <Button type="button" onClick={() => authClient.signOut()}>
//         Logout
//       </Button>
//     ) : (
//       <Button type="button" onClick={() => handleLogin()}>
//         Login with Hack Club
//       </Button>
//     )}
//   </div>

import Navbar from "@/components/navbar";

export default function Dashboard() {
  return <Navbar />;
}
