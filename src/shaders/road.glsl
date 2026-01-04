precision mediump float;
varying vec2 vUv;
void main(){
  vec3 base = vec3(0.12,0.12,0.12);
  if(mod(floor(vUv.x*20.0),2.0) < 0.5) base += 0.02;
  gl_FragColor = vec4(base,1.0);
}
