import logo from "../assets/logo.png";

function Navbar({ title }) {
  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">

          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="ADTEC"
              className="h-12"
            />

            <div>
              <h1 className="font-bold text-blue-900">
                {title}
              </h1>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;