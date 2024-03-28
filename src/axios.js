import axios from 'axios';
import {Buffer} from 'buffer';

// const baseURL = 'http://192.168.238.52:8000/api/';
const baseURL = 'http://localhost:8000/api/';

// const baseURL = 'http://192.168.43.99:8000/api/';
//const baseURL = 'http://192.168.87.235:8000/api/';
//const baseURL = 'http://192.168.61.235:8000/api/';
//const baseURL = 'http://192.168.89.235:8000/api/';

const localClientUrl ='http://localhost:3000/';
const remoteClientUrl ='http://192.168.43.99:3000/';


const axiosInstance = axios.create({
	baseURL: baseURL,
	timeout: 900000,
	headers: {
		Authorization: localStorage.getItem('access')
			? 'JWT ' + localStorage.getItem('access')
			: null,
		'Content-Type': 'application/json',
		accept: 'application/json',
	}, 
});

axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	async function (error) {
		const originalRequest = error.config;

		// alert("error.response: ",error.response);
		console.log(" originalRequest.url: ",originalRequest.url);
		// alert(" error.response.data.code: ",error.response.data.code," error.response.statusText: ",error.response.statusText);

		if (typeof error.response === 'undefined') {
			alert(
				'A server/network error occurred. ' +
					'Looks like CORS might be the problem. ' +
					'Sorry about this - we will get it fixed shortly.'
			);
			return Promise.reject(error);
		}

		if (
			error.response.status === 401 &&
			originalRequest.url === baseURL + 'token/refresh/'
		) {
			console.log("originalRequest.url: ",originalRequest.url)
			window.location.href = '/login/';
			return Promise.reject(error);
		}

		if (
			error.response.data.code === 'token_not_valid' &&
			error.response.status === 401 &&
			error.response.statusText === 'Unauthorized'
		) {
			const refreshToken = localStorage.getItem('refresh');

			if (refreshToken) {
				// const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
				// const tokenParts = URL.createObjectURL(new Blob([refreshToken.split('.')[1]],{type:'text/plain'}))
				const tokenParts = Buffer.from(refreshToken.split('.')[1], 'base64').toString('ascii');

				// exp date in token is expressed in seconds, while now() returns milliseconds:
				const now = Math.ceil(Date.now() / 1000);
				// console.log(refreshToken);
				// console.log(tokenParts);
				let expiration = Number(tokenParts.split("\"exp\":")[1].split(",")[0]);
				console.log(expiration,typeof(expiration),typeof(now))
				console.log();
				// console.log(Object.values(tokenParts));
				console.log(expiration,now,expiration > now);
				if (expiration > now) {
					return axiosInstance
						.post('/token/refresh/', { refresh: refreshToken })
						.then((response) => {
							console.log("RETURN REFRESH: ",response)
							localStorage.setItem('access', response.data.access);
							// localStorage.setItem('refresh', response.data.refresh);

							axiosInstance.defaults.headers['Authorization'] =
								'JWT ' + response.data.access;
							originalRequest.headers['Authorization'] =
								'JWT ' + response.data.access;

							return axiosInstance(originalRequest);
						})
						.catch((err) => {
							console.log(err);
						});
				} else {
					console.log('Refresh token is expired', expiration, now);
					window.location.href = '/';
				}
			} else {
				console.log('Refresh token not available.');
				window.location.href = '/login/';
			}
		}

		// specific error handling done elsewhere
		return Promise.reject(error);
	}
);

export default axiosInstance;
