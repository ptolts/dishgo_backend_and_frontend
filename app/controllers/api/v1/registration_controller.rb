class Api::V1::RegistrationController  < ApplicationController

  skip_before_filter :verify_authenticity_token
  respond_to :json

  def create

    if params[:email] and params[:password]
      user = User.new({ :email => params[:email], :password => params[:password] })
    else
      warden.custom_failure!
      render :json => user.errors, :status=>422
    end

    if user.save
      render :json => user.as_json(:auth_token=>user.authentication_token, :email=>user.email), :status=>201
      return
    else
      warden.custom_failure!
      render :json => user.errors, :status=>422
    end
  end

  def user_params 
    params.require(:user).permit(:email, :password)
  end

end