class Api::V1::RegistrationController  < ApplicationController

  skip_before_filter :verify_authenticity_token
  respond_to :json

  def create

    if params[:email].blank? or params[:password].blank?
      render :json => {:error => "Password and Email required."}, :status=>422
      return
    end

    if User.where(:email => params[:email]).count > 0
      render :json => {:error => "Email exists."}, :status=>422
      return      
    end
    
    @user = User.new({ :email => params[:email], :password => params[:password] })

    if sign_in @user
      @user.ensure_authentication_token!
      render :json => {:foodcloud_token=>@user.authentication_token}, :status=>201
      return
    else
      render :json => {:error => "Error."}, :status=>422
      return
    end
  end

  def user_params 
    params.require(:user).permit(:email, :password)
  end

end