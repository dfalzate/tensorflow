import React from 'react'

import * as posenet from '@tensorflow-models/posenet'
import '@tensorflow/tfjs'

interface IApp { }

const App: React.FC<IApp> = () => {

  React.useEffect(() => {
    // setupCamera()
  }, [])

  async function setupCamera() {

    const video: any = document.getElementById('video')
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        width: video.width,
        height: video.height,
        facingMode: 'user'
      }
    })
    video.srcObject = stream
    await video.play()
    const net = await posenet.load()
    const c: any = document.getElementById('canvasDraw')
    const ctx = c.getContext('2d');
    setInterval(async () => {
      ctx.clearRect(0, 0, c.width, c.height);
      const poses = await net.estimatePoses(video, {
        flipHorizontal: false,
        decodingMethod: 'single-person'
      })
      drawKeypoints(ctx, poses[0].keypoints)
    }, 100)
  }

  function drawKeypoints(ctx: any, keypoints: any) {
    keypoints.forEach(({ position }) => {
      const { x, y } = position
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, 2 * Math.PI, false)
      ctx.fillStyle = "red"
      ctx.fill()
    })
  }

  const regexp = /^[A-Za-záéíóúÁÉÍÓÚ\u00f1\u00d1\s]+$/i

  function onChange(e: any) {
    console.log(e.target.value)
    console.log(regexp.test(e.target.value))
  }

  return (
    <div className='main'>
      <div>By Diego</div>
      <div>
        {/* <canvas id='canvasDraw' width='1200' height='800'></canvas>
        <video id='video' width='1200' height='800'></video> */}
        <input type='text' onChange={onChange}></input>
      </div>
    </div>
  )
}

export default App
