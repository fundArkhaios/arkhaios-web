import Login from './login/login';	

import './globals.css';
import './../output.css';

export default function Page() {
	return (
		<html>
			<head>
				<title>Arkhaios</title>
				<link rel="icon" type="image/x-icon" href="/trimmedNoBackgroundHDArkhaiosLogo.ico"></link>	
			</head>
			<body>
				<Login/>
			</body>
		</html> 		
	);
}	
