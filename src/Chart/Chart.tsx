import {useEffect, useRef} from "react";

interface ChartProps {
  nitMax:number;
  nitValue:number;
  forecastMax:number;
  forecastValue:number;
}

export const Chart = ({nitMax,nitValue,forecastMax,forecastValue}:ChartProps) => {
  const refCanvas = useRef<HTMLCanvasElement | null>(null)
  const refWrapper = useRef<HTMLDivElement | null>(null)

  useEffect(()=>{
    if(refCanvas.current && refWrapper.current) {
      function fillCircle(ctx: any, width:number, height:number, radius:number, start:number,end:number,
                          color:string, lineWidth?:number){
        ctx.beginPath();
        ctx.arc(width,height,radius,start,end,false);
        if(lineWidth) ctx!.lineWidth = lineWidth;
        ctx!.strokeStyle = color;
        ctx?.stroke();
        ctx.closePath();
      }

      function fillText(ctx: any, text: string, x:number, y:number, color:string, fontSize:number,
                        textAlign:string, baseLine:string = 'middle', bold:boolean = false){
        ctx.beginPath();
        const textSplit = text.split('/');
        ctx.font = `${bold ? 'bold ':''}${fontSize}px Times New Roman`;
        ctx.textAlign = textAlign;
        ctx.textBaseline = baseLine;
        ctx.fillStyle = color;
        ctx.fillText(textSplit[0],x, y);

        if(textSplit[1]){
          ctx.fillStyle = 'grey';
          ctx.textAlign = 'start';
          ctx.fillText(`/${textSplit[1]}`,x + (width - x)/2.5, y);
        }
        ctx.closePath();
      }

      const ctx = refCanvas.current?.getContext("2d")

      const height = refWrapper.current.offsetHeight;
      const width = refWrapper.current.offsetWidth;

      refCanvas.current.width = width -4
      refCanvas.current.height = height - 4

      const nitPercent = Math.round(nitValue * 100 / nitMax)
      const forecastPercent = Math.round(forecastValue * 100 / forecastMax)
      let nitPercentTemp = 0
      let forecastPercentTemp = 0

      function Animation(){
        ctx?.clearRect(0,0,width,height)

        let radianNit = 2*Math.PI*(nitPercentTemp - nitPercentTemp/100 * 25)/100;
        let radianForecast = 2*Math.PI*(forecastPercentTemp - forecastPercentTemp/100 * 25)/100;

        fillCircle(ctx,width/2 , height/2,width/3.5,0, 2*Math.PI, 'lightgrey', width * 0.018)
        fillCircle(ctx,width/2 , height/2,width/3.5,0, radianForecast+ Math.PI/2, '#c0c0c0' )
        fillCircle(ctx,width/2 , height/2,width/5.5,0,  2*Math.PI, 'lightgrey', width * 0.13)
        fillCircle(ctx,width/2 , height/2,width/5.5,0,  radianNit+ Math.PI/2, '#ff6f00')

        ctx?.beginPath();
        ctx?.rect(width/2,height/2,width/2,width/2)
        ctx!.fillStyle = 'white'
        ctx?.fill()
        ctx?.closePath();

        fillText(ctx,`${nitPercentTemp}%`,width/2, height/2, "black",width*0.07,'center', 'middle',true)
        fillText(ctx,`${forecastPercentTemp}%`,width-width/7.5, height/2, "black",width*0.04,'center', 'bottom',true)

        const nitFormatNum = new Intl.NumberFormat('ru-RU').format(nitValue)
        const nitFormatNumMax = new Intl.NumberFormat('ru-RU').format(nitMax)
        const forecastFormatNum = new Intl.NumberFormat('ru-RU').format(forecastValue)
        const forecastFormatNumMax = new Intl.NumberFormat('ru-RU').format(forecastMax)

        fillText(ctx,'НИТ',5.5*width/10, height*0.6, "black",width*0.03,'left', 'bottom',false)
        fillText(ctx,`${nitFormatNum} / ${nitFormatNumMax}`,5.5*width/10, height*0.66, "black",width*0.05,'left','bottom',true)
        fillText(ctx,'ПРОГНОЗ',5.5*width/10, height*0.7, "black",width*0.03,'left', 'bottom',false)
        fillText(ctx,`${forecastFormatNum} / ${forecastFormatNumMax}`,5.5*width/10, height*0.76, "black",width*0.05,'left','bottom',true)

        if(forecastPercentTemp!==forecastPercent || nitPercent!==nitPercentTemp){
          if(nitPercent>nitPercentTemp){
            nitPercentTemp++
          }
          if(forecastPercent>forecastPercentTemp){
            forecastPercentTemp++
          }
          requestAnimationFrame(Animation)
        }
      }
      requestAnimationFrame(Animation)
    }
  },[nitMax,nitValue,forecastMax,forecastValue])

  return (
    <div ref={refWrapper} className='canvas'>
      <canvas
        ref={refCanvas}
      />
    </div>
  )
}