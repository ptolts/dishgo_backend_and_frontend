class RegistrationController < Devise::RegistrationsController
	def confirm
		Rails.logger.warn "rendering the fucking registration page."
		render 'confirm'
	end

	protected

	# def after_sign_up_path_for(resource)
	# 	'/an/example/path'
	# end

	def after_inactive_sign_up_path_for(resource)
		'/registration/confirm'
	end  
end