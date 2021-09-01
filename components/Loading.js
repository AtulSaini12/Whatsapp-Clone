import { Grid } from "@material-ui/core";
import { Circle } from "better-react-spinkit";

function Loading() {
  return (
    <center style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <div>
        <img
          src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png"
          alt="logo"
          style={{
            marginBottom: 20,
          }}
          height={150}
        />
        <Circle color="#3CBC28" size={50} />
      </div>
    </center>
  );
}

export default Loading;
