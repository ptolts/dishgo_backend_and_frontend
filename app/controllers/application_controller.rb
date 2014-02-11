class ApplicationController < ActionController::Base
  protect_from_forgery
  layout :layout_by_resource

 
  private
  
  def authenticate_user_from_token!
    user_email = params[:email].presence
    user       = user_email && User.find_by_email(user_email)
 
    # Notice how we use Devise.secure_compare to compare the token
    # in the database with the token given in the params, mitigating
    # timing attacks.
    if user && Devise.secure_compare(user.authentication_token, params[:user_token])
      sign_in user, store: false
    end
  end 

  def admin_user!
    unless current_user.is_admin
      flash[:error] = "You lack the privileges to access this function."
      redirect_to :controller => 'home', :action => 'index'
    end
  end

  protected

  def layout_by_resource
    if devise_controller?
      "devise"
    else
      "application"
    end
  end 

end
