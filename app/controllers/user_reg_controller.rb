class UserRegController < ApplicationController

  def create
    if params[:email].blank? or params[:password].blank?
      render :json => {:error => "Password and Email required."}, :status=>422
      return
    end

    if User.where(:email => params[:email].downcase).count > 0
      render :json => {:error => "Email exists."}, :status=>422
      return      
    end
    
    @user = User.new({ :email => params[:email].downcase, :password => params[:password] })
    @user.skip_confirmation!
    @user.skip_confirmation_notification!
    @user.api_confirmation = false
    @user.save!
    @user.ensure_authentication_token
    Email.delay.verify_from_network(@user)
    Email.delay.notify_admins(@user)

    if sign_in @user
      render :json => {success:true}
      return
    else
      render :json => {:error => "Error."}
      return
    end
  end

  def redirect
    if !params[:id].blank? and user = User.where(authentication_token:params[:id]).first and !user.api_confirmation
      user.api_confirmation = true
      user.save
    end
    redirect_to "https://dishgo.ca", status: 301
  end  

end
