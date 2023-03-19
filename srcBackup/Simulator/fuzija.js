var client;

var isWifi = false;
var isMqtt = false;
var isSensor = true;

var light = 45;
var temp = 25;
var pir = false;

var soba = document.getElementById("soba-in").value;
var myid = document.getElementById("id-in").value;
var komarac = document.getElementById("brocker-in").value;

var intervalin = document.getElementById("interval-in");

function errLight() {
  if (!isWifi) {
    document.getElementById("part-led-out").style.fill = "red";
    return;
  }
  if (!isMqtt) {
    document.getElementById("part-led-out").style.fill = "cyan";
    return;
  }
  if (!isSensor) {
    document.getElementById("part-led-out").style.fill = "green";
    return;
  }
  document.getElementById("part-led-out").style.fill = "white";
}

// PIR SENSOR
function releasePIR() {
  document.getElementById("part-pir").style.fill = "url(#gradient-1)";
  pir = false;
  console.log("pir", pir);
}
document.getElementById("part-pir").addEventListener("mouseover", () => {
  if (!pir) {
    document.getElementById("part-pir").style.fill = "red";
    pir = true;
    setTimeout(releasePIR, 8000);
    console.log("pir", pir);
  }
});
document.getElementById("part-pir").addEventListener("click", () => {
  alert();
});

// LIGHT SENSOR
document.getElementById("light-intens").addEventListener("change", () => {
  light = document.getElementById("light-intens").value;
  console.log("light", light);
  document.getElementById("light-num").innerText = light;
});

// TEMPERATURE SENSOR
document.getElementById("temp-intens").addEventListener("change", () => {
  temp = document.getElementById("temp-intens").value;
  console.log("temp", temp);
  document.getElementById("temp-num").innerText = temp;
});

// WIFI SWITCH
document.querySelector("#wifi-btn").addEventListener("click", () => {
  isWifi = !isWifi;
  console.log("wifi is", isWifi);
  mqttConnectIfOnNetwork();
  errLight();
});

// MQTT
function mqttConnectIfOnNetwork() {
  soba = document.getElementById("soba-in").value;
  myid = document.getElementById("id-in").value;
  komarac = document.getElementById("brocker-in").value;

  if (isWifi && (!client || !client.connected)) {
    console.log(komarac);
    client = mqtt.connect(komarac);
    client.publish(
      `newdevice`,
      JSON.stringify({ type: "fuzija", room: soba, id: myid })
    );
    isMqtt = true;
  }

  if (!isWifi || !isMqtt) {
    client = null;
    isMqtt = false;
  }
  errLight();
}

document.getElementById("mqtt-btn").addEventListener("click", () => {
  if (isMqtt) isMqtt = !isMqtt;
  mqttConnectIfOnNetwork();
});

// SIMULATE
function simulate() {
  errLight();

  if (isWifi && isMqtt) {
    var tosend = JSON.stringify({
      time: `${Date.now()}`,
      temp: temp,
      light: light,
      pir: pir,
    });
    document.getElementById("last-msg").value = tosend;
    client.publish(`fuzija/${soba}/${myid}`, tosend);
  }
}

var loop = setInterval(simulate, intervalin.value);

intervalin.addEventListener("change", () => {
  clearInterval(loop);
  loop = setInterval(simulate, intervalin.value);
});

errLight();
