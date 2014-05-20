class ApplicationController < ActionController::Base
  protect_from_forgery
  layout :layout_by_resource

 
  private

  def odesk_user!
    if Odesk.where(access_token:params[:id]).count == 9
      redirect_to :controller => 'administration', :action => 'index'
    end
  end

  # Overwriting the sign_out redirect path method
  def after_sign_out_path_for(resource_or_scope)
    "/app/users/sign_in"
  end  

  def admin_or_user_without_resto!
    if !current_user.is_admin and current_user.owns_restaurants
      redirect_to :controller => 'administration', :action => 'index'
    end
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

  def create_notifications!
    if current_user.stripe_token.blank? and current_user.confirmed_at and !current_user.cash_money
      if !current_user.notifications.any?{|e| e.created_at.today? and e.type == "trial_period"}
        user = current_user
        note = Notification.create
        note.type = "trial_period"
        days = (DateTime.now.to_time - user.confirmed_at).to_i / (24 * 60 * 60)
        days = 14 - days.to_i
        note.message = "Your trial period will end in #{days} days. Please navigate to the billing section, choose a plan and add the required payment method! Thanks!"
        return if user.notifications.any?{|e| e.message == note.message}
        note.save
        user.notifications << note
      end
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

  def admin_or_menu_image_owner!
    return if current_user.is_admin
    if current_user.owns_restaurants.nil? or current_user.owns_restaurants.id.blank? or (current_user.owns_restaurants.id.to_s != GlobalImage.where(id:params[:image_id]).first.restaurant_menu_images_id.to_s)
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
