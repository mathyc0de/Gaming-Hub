varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

// variáveis
// uv é um vec 2, uma coordenada x,y que envolve o sólido
// position ...
// normal é a direção do vetor normal



// estruturas
// varying declara variáveis globais, que, porém não podem ser modificadas no fragment
// uniform é uma constante
// struct é a definição de classes


// funções
// pow func para expoente
// mod => x % y
// step(vUv.x, x) func => vUv.x >= x ? 1 : 0
// smooth step => mesmo step, porém com uma transição suave
// length => lembrar da forma geométrica de um vetor 3d, onde o comprimento é uma projeção
// length(x) => sqrt(x * x) = x
// fract(float x) => retorna o resto do número. Exemplo: fract(3.6) => 0.6
// mix(x,y,a) => faz uma interpolação do ponto x ao y, sendo a (variando de 0 a 1), a porcentagem do deslocamento de x a y. Sendo 0 no ponto x e 1 no ponto y.
// dot => multiplicação escalar de vetores, útil para saber a direção resultante de dois vetores
// normalize() => transforma o vetor resultante no mesmo length

// Fresnel effect
//	vec3 viewDirection = normalize(cameraPosition - vPosition);
//	float fresnel = dot(viewDirection, vNormal);

void main() {
	//line
	// vec3(step(0.99, 1.0 - abs(vUv.x - 0.5)))
	gl_FragColor = vec4(vec3(0.5, 0.75, 1.0), 1);
}
