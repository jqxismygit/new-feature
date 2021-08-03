import React from 'react';
import styles from './index.less';
import { Button } from 'antd';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
const TWEEN = require('@tweenjs/tween.js');

let leftScene: BABYLON.Scene;
let rightScene: BABYLON.Scene;

let offset = 0;
let currentIdx = 0;

export default function IndexPage() {
  const canvasRef = React.useRef<any>(null);

  React.useEffect(() => {
    // const canvas = document.getElementById('renderCanvas'); // Get the canvas element
    const engine = new BABYLON.Engine(canvasRef.current, true, {
      preserveDrawingBuffer: true,
      stencil: true,
      disableWebGL2Support: false,
    }); // Generate the BABYLON 3D engine

    // Add your code here matching the playground format
    var createScene = function () {
      var scene = new BABYLON.Scene(engine);

      var scene2 = new BABYLON.Scene(engine);

      leftScene = scene;
      rightScene = scene2;
      //Camera
      var camera = new BABYLON.ArcRotateCamera(
        'Camera',
        -Math.PI / 2,
        Math.PI / 2,
        10,
        BABYLON.Vector3.Zero(),
        scene,
      );
      camera.setTarget(BABYLON.Vector3.Zero());
      camera.setPosition(new BABYLON.Vector3(0, 0.5, -10));
      // camera.attachControl(canvasRef.current, true);

      //ViewBox
      var viewBox = BABYLON.MeshBuilder.CreateBox(
        'viewBox',
        { width: 1, height: 1, depth: 1 },
        scene2,
      );

      //CameraView
      scene2.createDefaultCameraOrLight();

      //light
      var light = new BABYLON.HemisphericLight(
        'light1',
        new BABYLON.Vector3(0, 1, 0),
        scene,
      );
      light.intensity = 0.7;

      //sphere
      var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);
      sphere.position.y = 1;

      //ground
      var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);

      camera.viewport = new BABYLON.Viewport(0, 0, 1, 1);
      scene2.activeCamera.viewport = new BABYLON.Viewport(1, 0, 0, 1);

      scene.autoClearDepthAndStencil = false;
      scene.autoClear = false;

      engine.runRenderLoop(() => {
        scene2.render();
      });

      return scene;
    };

    if (canvasRef.current) {
      const scene = createScene(); //Call the createScene function

      engine.runRenderLoop(function () {
        if (scene && scene.activeCamera) {
          scene.render();
        }
      });
    }
  }, []);

  const resetViewport = (offset: number) => {
    leftScene.activeCamera.viewport = new BABYLON.Viewport(0, 0, 1 - offset, 1);
    rightScene.activeCamera.viewport = new BABYLON.Viewport(
      1 - offset,
      0,
      offset,
      1,
    );
  };

  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

  // Set the drag hook and define component movement based on gesture data
  const bind = useDrag(
    ({ down, movement: [mx, my], cancel, direction: [dir] }) => {
      offset = Math.abs(mx) / window.innerWidth;
      if (mx < 0 && currentIdx === 0) {
        if (!down) {
          const tweenOffset = { offset }; // Start at (0, 0)
          if (offset > 0.5) {
            const tween = new TWEEN.Tween(tweenOffset) // Create a new tween that modifies 'coords'.
              .to({ offset: 1 }, 500) // Move to (300, 200) in 1 second.
              .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
              .onUpdate(() => {
                resetViewport(tweenOffset.offset);
              })
              .onComplete(() => {
                // console.log('onComplete = ', coords.x);
                currentIdx = tweenOffset.offset;
              })
              .start(); // Start the tween immediately.
          } else {
            const tween = new TWEEN.Tween(tweenOffset) // Create a new tween that modifies 'coords'.
              .to({ offset: 0 }, 500) // Move to (300, 200) in 1 second.
              .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
              .onUpdate(() => {
                resetViewport(tweenOffset.offset);
              })
              .onComplete(() => {
                currentIdx = tweenOffset.offset;
              })
              .start(); // Start the tween immediately.
          }
        } else {
          resetViewport(offset);
        }
      } else if (mx > 0 && currentIdx === 1) {
        if (!down) {
          const tweenOffset = { offset: 1 - offset }; // Start at (0, 0)
          if (offset > 0.5) {
            const tween = new TWEEN.Tween(tweenOffset) // Create a new tween that modifies 'coords'.
              .to({ offset: 0 }, 500) // Move to (300, 200) in 1 second.
              .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
              .onUpdate(() => {
                resetViewport(tweenOffset.offset);
              })
              .onComplete(() => {
                // console.log('onComplete = ', coords.x);
                currentIdx = tweenOffset.offset;
              })
              .start(); // Start the tween immediately.
          } else {
            const tween = new TWEEN.Tween(tweenOffset) // Create a new tween that modifies 'coords'.
              .to({ offset: 1 }, 500) // Move to (300, 200) in 1 second.
              .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
              .onUpdate(() => {
                resetViewport(tweenOffset.offset);
              })
              .onComplete(() => {
                currentIdx = tweenOffset.offset;
              })
              .start(); // Start the tween immediately.
          }
        } else {
          resetViewport(1 - offset);
        }
      }
    },
  );

  // const bind = useDrag((obj) => {
  //   // api.start({ x: down ? mx : 0, y: down ? my : 0 });
  //   console.log('--------->>>', obj);
  //   // console.log('--------->>>', movement);
  // });
  // console.log('offset =====>>', x, y);

  React.useEffect(() => {
    function animate(time) {
      requestAnimationFrame(animate);
      TWEEN.update(time);
    }
    requestAnimationFrame(animate);
    // const coords = { x: 0, y: 0 }; // Start at (0, 0)
    // const tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
    //   .to({ x: 300, y: 200 }, 1000) // Move to (300, 200) in 1 second.
    //   .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
    //   .onUpdate(() => {
    //     // Called after tween.js updates 'coords'.
    //     // Move 'box' to the position described by 'coords' with a CSS translation.
    //     console.log('coords.x = ', coords.x);
    //   })
    //   .onComplete(() => {
    //     console.log('onComplete = ', coords.x);
    //   })
    //   .start(); // Start the tween immediately.
    // console.log('------ssdsdsds', tween);
  }, []);
  return (
    <>
      <animated.canvas
        id="renderCanvas"
        touch-action="none"
        ref={canvasRef}
        {...bind()}
        style={{ width: '100%', height: '100%' }}
      ></animated.canvas>
      {/* <Button
        style={{ position: 'absolute', left: '0px', top: '0px' }}
        onClick={() => {
          // console.log('offset = ', offset);
          // if (offset + 0.02 <= 1) {
          //   offset = offset + 0.02;
          //   resetViewport(offset);
          // }
          api.start({ x: 1, y: 1 });
        }}
      >
        左移
      </Button>
      <Button
        style={{ position: 'absolute', left: '0px', top: '100px' }}
        onClick={() => {
          // console.log('offset = ', offset);
          // if (offset - 0.02 >= 0) {
          //   offset = offset - 0.02;
          //   resetViewport(offset);
          // }
        }}
      >
        右移
      </Button> */}
      {/* <div
        ref={barrageRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
        }}
      ></div> */}
      {/* 所有的插件都条件渲染 */}
    </>
  );
}
