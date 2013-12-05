class Api::V1::UserController < ApplicationController
  include ApiHelper
  before_filter :validate_auth_token
  respond_to :json

  def add_address

    if params[:street_address].blank? or params[:street_number].blank? or params[:city].blank?
      render :status=>400,
        :json=>{:message=>"The request must contain complete address information."}
      return   
    end 

    addy = Address.new
    addy.street_number = params[:street_number]
    addy.street_address = params[:street_address]
    addy.appt_number = params[:appt_number]
    addy.city = params[:city]
    addy.postal_code = params[:postal_code]
    addy.province = params[:province]
    addy.default = true

    current_user.addresses.each do |e| 
      e.default = false
      e.save
    end

    addy.user = current_user
    addy.save

    render :json => {:success=>true}

  end
end