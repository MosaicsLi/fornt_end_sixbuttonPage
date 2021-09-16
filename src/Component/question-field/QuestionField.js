import { useEffect, useState } from "react";
import { Button, Card, FloatingLabel, Form } from "react-bootstrap";
import axios from "axios";
import qs from "qs";

export default function QuestionField() {
  const [question, setQuestion] = useState("");
  const [sys_data, set_sys_data] = useState({
    text: "",
    sys_reply_text: String,
    data: {},
  });
  const [text_input, settext_input] = useState("");// get usetinput
  function oninputChange(event) {
    settext_input(event.target.value);
  }

  async function getTTSData() {
    var key = {
      text_input: text_input,
      lang: 'ch',
    }, url = "http://35.224.193.144:19999/tts_api/";
    let apidata = await axios.post(url, qs.stringify(key));//Connect API
    /*setTTSData(apidata.data);
    console.log(ttsdata) ;*/
    let res = apidata.data['wav_array'];
    audiobuffermaker(res);
  }

  function onSpeakClick() {
    getTTSData();
  }

  function audiobuffermaker(data) {

    var floatttsdata = new Float32Array(JSON.parse(data));
    //console.log(floatttsdata);
    //make useState data to Float32Array

    let AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx;
    let channels = 1;
    function init() {
      audioCtx = new AudioContext();
    }
    if (!audioCtx) {
      init();
    }
    let frameCount = floatttsdata.length;//Set the length to match the length of the array 
    //let frameCount = audioCtx.sampleRate  ;
    let myArrayBuffer = audioCtx.createBuffer(channels, frameCount, 24000);
    for (let channel = 0; channel < channels; channel++) {
      // This gives us the actual array that contains the data
      let nowBuffering = myArrayBuffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        nowBuffering[i] = floatttsdata[i];
        //Set Float32Array Audio Data to Audiobuffer
      }
    }
    var blob = bufferToWave(myArrayBuffer, frameCount);
    var audio = document.getElementById('AudioPlay')
    audio.style.display = "block";
    audio.src = URL.createObjectURL(blob);
  }
  function bufferToWave(abuffer, len) {//make Audiobuffer to .wave
    var numOfChan = abuffer.numberOfChannels,
      length = len * numOfChan * 2 + 44,
      buffer = new ArrayBuffer(length),
      view = new DataView(buffer),
      channels = [], i, sample,
      offset = 0,
      pos = 0;

    // write WAVE header
    setUint32(0x46464952);                         // "RIFF"
    setUint32(length - 8);                         // file length - 8
    setUint32(0x45564157);                         // "WAVE"
    setUint32(0x20746d66);                         // "fmt " chunk
    setUint32(16);                                 // length = 16
    setUint16(1);                                  // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2);                      // block-align
    setUint16(16);                                 // 16-bit (hardcoded in this demo)
    setUint32(0x61746164);                         // "data" - chunk
    setUint32(length - pos - 4);                   // chunk length
    // write interleaved data
    for (i = 0; i < abuffer.numberOfChannels; i++)
      channels.push(abuffer.getChannelData(i));

    while (pos < length) {
      for (i = 0; i < numOfChan; i++) {             // interleave channels
        sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
        view.setInt16(pos, sample, true);          // write 16-bit sample
        pos += 2;
      }
      offset++                                     // next source sample
    }

    // create Blob
    return new Blob([buffer], { type: "audio/wav" });

    function setUint16(data) {
      view.setUint16(pos, data, true);
      pos += 2;
    }

    function setUint32(data) {
      view.setUint32(pos, data, true);
      pos += 4;
    }
  }

  const [reply, setReply] = useState(["BOT的回答會在這邊出現"]);
  const replies = reply.map((reply) => {
    const split = reply.split("<br>");
    return split.map((split, index) => <h3 key={index}>{split}</h3>);
  });
  const MRT_URL = "http://52.147.71.0:10000/api/MRT/say2bot";

  function textAreaChangeHandler(event) {
    setQuestion(event.target.value);
  }

  function clickHandler() {
    set_sys_data((prevValue) => {
      return {
        ...prevValue,
        text: question,
      };
    });
  }

  async function sendQuestion() {
    try {
      const reply = await axios.post(MRT_URL, sys_data);
      setQuestion("");
      set_sys_data(reply.data);
      setReply(reply.data["sys_reply_text"]);
      console.log(reply.data["sys_reply_text"]);
      if (reply.data["SYS_STAGE"] === "COMPLETE") {
        set_sys_data({
          text: "",
          sys_reply_text: String,
          data: {},
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    sendQuestion();
  }, [sys_data.text]);
  return (
    <Card className="card-margin">
      <Card.Body>
        <div className="p-5 text-center">
          <Card.Title>歡迎使用我們的服務</Card.Title>
          <Card.Subtitle>請選擇捷運站</Card.Subtitle>
          <Form.Select className="add-margin">
            <option selected value="gangqian">
              港墘站
            </option>
          </Form.Select>
          <>
            <FloatingLabel controlId="questionTextArea" label="問題">
              <Form.Control
                as="textarea"
                placeholder="輸入您的問題"
                style={{ height: "100px" }}
                value={question}
                onChange={textAreaChangeHandler}
              />
            </FloatingLabel>
          </><Button
            className="add-margin"
            variant="primary"
            style={{ backgroundColor: "#f5ba13", borderColor: "#f5ba13" }}
            onClick={clickHandler}
          >
            送出
          </Button>
          <br />
          <input onChange={oninputChange}></input>
          <Button variant="secondary" onClick={onSpeakClick} style={{ backgroundColor: "#f5ba13", borderColor: "#f5ba13" }}>
            說話
          </Button>
          <p><audio id="AudioPlay" controls style={{ display: "none" }}></audio></p>
          <div>{replies}</div>
        </div>
      </Card.Body>
    </Card>
  );
}
