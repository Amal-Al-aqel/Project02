import { createEvent } from '@testing-library/dom';
import React, { Component } from 'react'

export default class Wheel extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

        const itemsList = this.props.itemsList;
        const colors = this.props.colors;
        //let length = this.state.itemsList.length;
        
        // let constColors = theColors.map(function (element, index) {
        //     theColors[index] = "#" + Math.floor(Math.random() * 16777215).toString(16);
        //     console.log(theColors[index]);
        // })
        console.log("jjjjjjjjjj");
        console.log(colors);
        //let randomColors = this.state.data.colors;
        //console.log(randomColors);
        let sectors = itemsList.map(function (element, index) {
            return { label: element, color: colors[index].hex.value }
        });
        //console.log("kakkkakakakak");
        //console.log(colors);

        const rand = (m, M) => Math.random() * (M - m) + m;
        const tot = sectors.length;
        const EL_spin = document.querySelector("#spin");
        console.log(EL_spin);
        const ctx = document.querySelector("#wheel").getContext('2d');
        const dia = ctx.canvas.width;
        const rad = dia / 2;
        const PI = Math.PI;
        const TAU = 2 * PI;
        const arc = TAU / sectors.length;

        const friction = 0.991; // 0.995=soft, 0.99=mid, 0.98=hard
        let angVel = 0; // Angular velocity
        let ang = 0; // Angle in radians

        const getIndex = () => Math.floor(tot - ang / TAU * tot) % tot;

        function drawSector(sector, i) {
            const ang = arc * i;
            ctx.save();
            // COLOR
            ctx.beginPath();
            ctx.fillStyle = sector.color;
            ctx.moveTo(rad, rad);
            ctx.arc(rad, rad, rad, ang, ang + arc);
            ctx.lineTo(rad, rad);
            ctx.fill();
            // TEXT
            ctx.translate(rad, rad);
            ctx.rotate(ang + arc / 2);
            ctx.textAlign = "right";
            ctx.fillStyle = "#fff";
            ctx.font = "bold 20px sans-serif";
            ctx.fillText(sector.label, rad - 10, 10);
            //
            ctx.restore();
        };

        function rotate() {
            const sector = sectors[getIndex()];
            ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
            EL_spin.textContent = !angVel ? "SPIN" : sector.label;
            EL_spin.style.background = sector.color;
        }

        function frame() {
            if (!angVel) return;
            angVel *= friction; // Decrement velocity by friction
            if (angVel < 0.002) angVel = 0; // Bring to stop
            ang += angVel; // Update angle
            ang %= TAU; // Normalize angle
            rotate();
        }

        function engine() {
            frame();
            requestAnimationFrame(engine)
        }

        // INIT
        sectors.forEach(drawSector);
        console.log(sectors);
        rotate(); // Initial rotation
        engine(); // Start engine
        EL_spin.addEventListener("click", () => {
            if (!angVel) angVel = rand(0.25, 0.35);
        });

    }

    render() {
        return (
            <div id="wheelOfFortune" >
                <canvas id="wheel" width="400" height="400"></canvas>
                <div id="spin">SPIN</div>
            </div>
        )
    }
}
