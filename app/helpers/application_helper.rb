module ApplicationHelper

	def active_link(controller,action)
		current_page?(controller: controller, action: action) ? 'active' : nil
	end

	def admin_user?
		current_user.is_admin
	end

	def sign_up_progress(action)
		if current_user.is_admin
			return true
		end
		Rails.logger.warn "Current Status: #{current_user.sign_up_progress.to_s}"
		if current_user.sign_up_progress[action]
			return true
		else 
			return false
		end
	end

end
