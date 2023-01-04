export default function Animtion() {
  return (
    <section className="container">
      <div className="content_box">
        <div className="circle">
          <img
            className="box"
            src="./space-shuttle-solid.svg"
            alt="dot"
          />
        </div>
        <div className="background_box b1">
          <div className="background c1" />
        </div>
        <div className="background_box b2">
          <div className="background c2" />
        </div>
        <div className="background_box b3">
          <div className="background c3" />
        </div>
        <div className="background_box b4">
          <div className="background c4" />
        </div>
      </div>
      <div className="preloader">
        <div className="item" />
        <div className="item" />
        <div className="item" />
        <div className="item" />
        <div className="item" />
      </div>
      <div className="orbit-animation">
        <div className="sizer">
          <div className="wrapper">
            <div className="solar-system">
              <div className="orbit positioner saturn">
                <div className="planet" />
              </div>
              <div className="orbit positioner uranus">
                <div className="planet" />
              </div>
              <div className="orbit positioner neptune">
                <div className="planet" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
