exports.welcomeMessage = (name) => {
	return `
    <div style="font-family: sans-serif; margin:0; background-color:rgb(72, 72, 155);">
    <div style=" padding-top:30px; padding-left:40px; width:80%; margin-left:auto; margin-right:auto" >
        
        <p style="margin:0; font-size:20px ">Logo</p>

        <h3 style="color:white; padding-top:30px; padding-bottom:20px; font-size:20px; margin:0"> ${name}, Welcome TO RONZL</h3>
    
        <p style="color:white;padding-top:20px; padding-bottom:20px; line-height: 2em;">Thanks for registering an account on RONZL. 
            We're excited to see you join the community! As a member of RONZL, when you subscribe you get access to all our wonderfull features. We cant wait to help you get started.</p>
        
        <p style="color:white;padding-top:10px; padding-bottom:10px; line-height: 2em;">The best thing about RONZL is our incredible community.</p>

        <p style="color:white;padding-top:10px; padding-bottom:10px; line-height: 2em;">Take some time to look around and if you have any questions, feel free to contact us.</p>
        <hr style="color:white"/>
    
        <div style="color:white; text-decoration:none;padding-top:10px; padding-bottom:10px;">
            You are receiving this email because you are a registered user on <a href="https://www.ronzlsdesk.co.uk"> RONZL<a>
        </div>
    </div>
</div>
         `
}

exports.forgetMessage = (email, emailtoken) => {
	return `
    <div style="font-family: sans-serif; margin:0; background-color:rgb(72, 72, 155);">
	<div style=" padding-top:30px; padding-left:40px; width:80%; margin-left:auto; margin-right:auto" >
		
		<p style="margin:0; font-size:20px ">Logo</p>

		<h3 style="color:white; padding-top:30px; padding-bottom:20px; font-size:20px; margin:0; font-weight: bold;"> Dont worry, we all forget sometimes</h3>
		
		<hr style="color:white"/>
		
<p style="color:white;padding-top:20px; padding-bottom:20px; line-height: 2em;">Hi ${email}, You recently asked to reset your password for this RONZL account: <br>
${email}</p>
		
		<p style="color:white;padding-top:10px; padding-bottom:10px; line-height: 2em;">To update your account, click the button below.</p>

        <button style="background-color: white;  border-radius: 5px; padding:10px">
        <a style="text-decoration:none; color:blue;" href="http://www.localhost:3000/resetpage?token=${emailtoken}"">Reset my password</a>
    </button>

		<p style="color:white;padding-top:10px; line-height: 2em; margin:0">Cheers,</p>
		<p style="color:white; padding-bottom:10px; line-height: 2em;margin:0">RONZL</p>
	
		<div style="color:white; text-decoration:none;padding-top:10px; padding-bottom:10px;">
			You are receiving this email because you are a registered user on <a href="https://www.ronzlsdesk.co.uk"> RONZL<a>
		</div>
	</div>
</div>
`
}

exports.resetSucess = (name) => {
	return `
    <div style="font-family: sans-serif; margin:0; background-color:rgb(72, 72, 155);">
	<div style=" padding-top:30px; padding-left:40px; width:80%; margin-left:auto; margin-right:auto" >
		
		<p style="margin:0; font-size:20px ">Logo</p>

		<h3 style="color:white; padding-top:30px; padding-bottom:20px; font-size:20px; margin:0; font-weight: bold;"> You have got a new password</h3>
		
		
		
		<p style="color:white;padding-top:20px; padding-bottom:20px; line-height: 2em;">Hi ${name}, You have successfully updated your password, if you did not make this change, please contact us.</p>
		
		

		<button style="background-color: white;  border-radius: 5px; padding:10px; margin-top:20xp; margin-bottom: 40px;">
			<a style="text-decoration:none; color:blue; font-size:20px" href="https://localhost:3000">Go to RONZL </a>
		</button>


		<hr style="color:white"/>
	
		<div style="color:white; text-decoration:none;padding-top:10px; padding-bottom:10px;">
			You are receiving this email because you are a registered user on <a href="https://www.ronzlsdesk.co.uk"> RONZL<a>
		</div>
	</div>
</div>
    `
}

exports.premiumMessage = (name) => {
	return `
    <div style="font-family: sans-serif; margin:0; background-color:rgb(72, 72, 155);">
	<div style=" padding-top:30px; padding-left:40px; width:80%; margin-left:auto; margin-right:auto" >
		
		<p style="margin:0; font-size:20px ">Logo</p>

		<h3 style="color:white; padding-top:30px; padding-bottom:20px; font-size:20px; margin:0; font-weight: bold;"> Welcome To Premium</h3>
		<p style="color:white; padding-bottom:20px; line-height: 2em;">Hi ${name}, You now have everything you need to get ahead.</p>
		
		<h5 style="color:white; padding-top:10px; padding-bottom:20px; font-size:20px; margin:0; font-weight: bold;"> Here are some of the things you can do</h5>

		<ul style="color:white; line-height: 2em; margin-bottom:20px">
			<li>Request for accounting services with a simple form</li>
			<li>Send any kind of document to the accounting firm</li>
			<li>You will be able to schedule appointment and notified by mail in case, if resheduled, confirmed or declined</li>
			<li>And Many other features</li>
		</ul>
		

		<button style="background-color: white;  border-radius: 5px; padding:10px; margin-top:20xp; margin-bottom: 40px;">
			<a style="text-decoration:none; color:blue; font-size:20px" href="https://localhost:3000">Go to RONZL </a>
		</button>


		<hr style="color:white"/>
	
		<div style="color:white; text-decoration:none;padding-top:10px; padding-bottom:10px;">
			You are receiving this email because you are a registered user on <a href="https://www.ronzlsdesk.co.uk"> RONZL<a>
		</div>
	</div>
</div>
    
    `
}

exports.appointmentMessage = (name) => {
	return `
    <div style="font-family: sans-serif; margin:0; background-color:rgb(72, 72, 155);">
	<div style=" padding-top:30px; padding-left:40px; width:80%; margin-left:auto; margin-right:auto" >
		
		<p style="margin:0; font-size:20px ">Logo</p>

		<h3 style="color:white; padding-top:30px; padding-bottom:20px; font-size:20px; margin:0; font-weight: bold;"> Welcome!!!</h3>
		<p style="color:white; padding-bottom:20px; line-height: 2em;">Hi ${name}, Your appointment has been confirmed.</p>
		
		<button style="background-color: white;  border-radius: 5px; padding:10px; margin-top:20xp; margin-bottom: 40px;">
			<a style="text-decoration:none; color:blue; font-size:20px" href="https://localhost:3000">Go to RONZL </a>
		</button>

		<hr style="color:white"/>
	
		<div style="color:white; text-decoration:none;padding-top:10px; padding-bottom:10px;">
			You are receiving this email because you are a registered user on <a href="https://www.ronzlsdesk.co.uk"> RONZL<a>
		</div>
	</div>
</div>
    
    `
}

exports.appointmentConfirmed = (name) => {
	return `
    <div style="font-family: sans-serif; margin:0; background-color:rgb(72, 72, 155);">
	<div style=" padding-top:30px; padding-left:40px; width:80%; margin-left:auto; margin-right:auto" >
		
		<p style="margin:0; font-size:20px ">Logo</p>

		<h3 style="color:white; padding-top:30px; padding-bottom:20px; font-size:20px; margin:0; font-weight: bold;"> Welcome!!!</h3>
		<p style="color:white; padding-bottom:20px; line-height: 2em;">Hi ${name}, Your appointment has been confirmed.</p>
		
		<button style="background-color: white;  border-radius: 5px; padding:10px; margin-top:20xp; margin-bottom: 40px;">
			<a style="text-decoration:none; color:blue; font-size:20px" href="https://localhost:3000">Go to RONZL </a>
		</button>

		<hr style="color:white"/>
	
		<div style="color:white; text-decoration:none;padding-top:10px; padding-bottom:10px;">
			You are receiving this email because you are a registered user on <a href="https://www.ronzlsdesk.co.uk"> RONZL<a>
		</div>
	</div>
</div>
    
    `
}

exports.rejectAppointmentMessage = (name) => {
	return `
    <div style="font-family: sans-serif; margin:0; background-color:rgb(72, 72, 155);">
	<div style=" padding-top:30px; padding-left:40px; width:80%; margin-left:auto; margin-right:auto" >
		
		<p style="margin:0; font-size:20px ">Logo</p>

		<h3 style="color:white; padding-top:30px; padding-bottom:20px; font-size:20px; margin:0; font-weight: bold;"> Welcome!!!</h3>
		<p style="color:white; padding-bottom:20px; line-height: 2em;">Hi ${name}, Your appointment has been rejected.</p>
		
		<button style="background-color: white;  border-radius: 5px; padding:10px; margin-top:20xp; margin-bottom: 40px;">
			<a style="text-decoration:none; color:blue; font-size:20px" href="https://localhost:3000">Go to RONZL </a>
		</button>

		<hr style="color:white"/>
	
		<div style="color:white; text-decoration:none;padding-top:10px; padding-bottom:10px;">
			You are receiving this email because you are a registered user on <a href="https://www.ronzlsdesk.co.uk"> RONZL<a>
		</div>
	</div>
</div>
    
    `
}