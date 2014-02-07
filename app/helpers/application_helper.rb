module ApplicationHelper

	def active_link(controller,action)
		current_page?(controller: controller, action: action) ? 'active' : nil
	end

	def admin_user?
		current_user.is_admin
	end
end
