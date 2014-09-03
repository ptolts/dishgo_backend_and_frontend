class Api::V1::RegistrationController  < ApplicationController
  skip_before_filter :verify_authenticity_token  
  respond_to :json

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
    Email.verify_from_app(@user)
    begin
      Email.notify_admins(@user)
    rescue => msg
    end

    @user.create_x_dishcoins 1

    if sign_in @user
      render :json => {:foodcloud_token=>@user.authentication_token,:dishgo_token=>@user.authentication_token}, :status=>201
      return
    else
      render :json => {:error => "Error."}, :status=>422
      return
    end
  end

  def redirect
    if !params[:token].blank? and user = User.where(authentication_token:params[:token]).first and !user.api_confirmation
      user.api_confirmation = true
      user.save
    end
    redirect_to "dishgo://?dishgo_token=#{params[:token]}", status: 301
  end

  def user_params 
    params.require(:user).permit(:email, :password)
  end

end