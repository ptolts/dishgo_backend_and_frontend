class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :configure_permitted_parameters, if: :devise_controller?
  layout :layout_by_resource

  def page_not_found
    respond_to do |format|
      format.html { render template: 'errors/not_found_error', layout: 'layouts/devise', status: 404 }
      format.all  { render nothing: true, status: 404 }
    end
  end

  def server_error
    respond_to do |format|
      format.html { render template: 'errors/internal_server_error', layout: 'layouts/devise', status: 500 }
      format.all  { render nothing: true, status: 500}
    end
  end

  private

  def odesk_user!
    if Odesk.where(access_token:(params[:id] || params[:odesk_id])).count == 0
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

  def skip_link
    if id = params[:id] and !id.blank? and user = User.where(setup_link:id) and user = user.first
      sign_in user
    else
      redirect_to "https://dishgo.io"
    end
  end

  def admin_or_user_with_resto!
    if !current_user.is_admin and !current_user.owns_restaurants
      redirect_to :controller => 'administration', :action => 'restaurant_setup'
    end
  end

  def validate_auth_token
    if params[:dishgo_token].blank? 
      render :status => 401, :json => {error: "Not Logged In"}
      return
    end
    user = User.where(:authentication_token => params[:dishgo_token]).first    
    if !user 
      render :status => 401, :json => {error: "Not Logged In"}
      return
    end
    sign_in user
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
    # if current_user.stripe_token.blank? and current_user.confirmed_at and !current_user.cash_money
    #   if !current_user.notifications.any?{|e| e.created_at.today? and e.type == "trial_period"}
    #     user = current_user
    #     note = Notification.create
    #     note.type = "trial_period"
    #     days = (DateTime.now.to_time - user.confirmed_at).to_i / (24 * 60 * 60)
    #     days = 14 - days.to_i
    #     note.message = "Your trial period will end in #{days} days. Please navigate to the billing section, choose a plan and add the required payment method! Thanks!"
    #     return if user.notifications.any?{|e| e.message == note.message}
    #     note.save
    #     user.notifications << note
    #   end
    # end
  end  

  def sign_in_user_for_prizes
    if id = params[:token] and !id.blank? and user = User.where(authentication_token: id).first and user
      sign_in user
    end
  end

  def admin_user!
    if !current_user or !current_user.is_admin
      flash[:error] = "You lack the privileges to access this function."
      redirect_to :controller => 'administration', :action => 'index'
    end
  end

  def api_admin_or_owner!
    if params["dishgo_token"].blank?
      redirect_to :controller => 'administration', :action => 'index'
    end
    user = User.where(authentication_token:params["dishgo_token"]).first
    if !user
      redirect_to :controller => 'administration', :action => 'index'
    end
    sign_in user
    return if user.is_admin
    if user.owns_restaurants.nil? or user.owns_restaurants.id.blank? or (user.owns_restaurants.id.to_s != params["restaurant_id"].to_s)
      flash[:error] = "You lack the privileges to access this function."
      redirect_to :controller => 'administration', :action => 'index'
    end
  end

  def api_admin_or_owner_variable_only!
    if params["dishgo_token"].blank?
      render :status => 401, :json => {error: "Not Logged In"}      
      return
    end
    user = User.where(authentication_token:params["dishgo_token"]).first
    if !user
      render :status => 401, :json => {error: "Not Logged In"}      
      return
    end
    sign_in user
    if user.is_admin
      @admin = true
    end
    if user.owns_restaurants.nil? or user.owns_restaurants.id.blank? or (user.owns_restaurants.id.to_s != params["restaurant_id"].to_s)
      return
    end
    @owner = true
  end   

  def admin_or_owner!
    return if current_user.is_admin
    if current_user.owns_restaurants.nil? or current_user.owns_restaurants.id.blank? or (current_user.owns_restaurants.id.to_s != params[:restaurant_id].to_s)
      flash[:error] = "You lack the privileges to access this function."
      redirect_to :controller => 'administration', :action => 'index'
    end
  end

  def admin_or_owner_or_odesk!
    if !params[:odesk_id].blank? and Odesk.where(access_token:params[:odesk_id]).count == 1
      params.delete :restaurant_id
      return
    end
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

  def admin_or_profile_image_owner!
    return if current_user.is_admin
    if current_user.owns_restaurants.nil? or current_user.owns_restaurants.id.blank? or (current_user.owns_restaurants.id.to_s != Image.where(id:params[:image_id]).first.restaurant_id.to_s)
      flash[:error] = "You lack the privileges to access this function."
      redirect_to :controller => 'administration', :action => 'index'
    end
  end

  def admin_or_gallery_image_owner!
    return if current_user.is_admin
    if current_user.owns_restaurants.nil? or current_user.owns_restaurants.id.blank? or (current_user.owns_restaurants.id.to_s != Image.where(id:params[:image_id]).first.restaurant_gallery_id.to_s)
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

  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:account_update) do |u|
      Rails.logger.warn "HAHAHAHAHAHA"
      u.permit :password, :password_confirmation, :reset_password_token
    end
  end

end
