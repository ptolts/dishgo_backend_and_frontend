class ApplicationController < ActionController::Base
  protect_from_forgery
  layout :layout_by_resource

 
  private

  # Overwriting the sign_out redirect path method
  def after_sign_out_path_for(resource_or_scope)
    "/app/users/sign_in"
  end  

  def admin_or_user_with_resto!
    if !current_user.is_admin and !current_user.owns_restaurants
      redirect_to :controller => 'administration', :action => 'restaurant_setup'
    end
  end
  
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
      redirect_to :controller => 'administration', :action => 'index'
    end
  end

  def admin_or_owner!
    return if current_user.is_admin
    if current_user.owns_restaurants.nil? or current_user.owns_restaurants.id.blank? or (current_user.owns_restaurants.id.to_s != params[:restaurant_id].to_s)
      flash[:error] = "You lack the privileges to access this function."
      redirect_to :controller => 'administration', :action => 'index'
    end
  end

  def admin_or_image_owner!
    return if current_user.is_admin
    if current_user.owns_restaurants.nil? or current_user.owns_restaurants.id.blank? or (current_user.owns_restaurants.id.to_s != GlobalImage.where(id:params[:image_id]).first.restaurant_id.to_s)
      flash[:error] = "You lack the privileges to access this function."
      redirect_to :controller => 'administration', :action => 'index'
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

  def handle_unverified_request
    redirect_to root_url, :error => "forgery protection"
  end  

end
