class Users::RegistrationController < Devise::RegistrationsController
	
	def confirm
		render 'confirm'
	end

	protected

	# def after_sign_up_path_for(resource)
	# 	'/an/example/path'
	# end

	def after_inactive_sign_up_path_for(resource)
		'/app/users/registration/confirm'
	end  
end