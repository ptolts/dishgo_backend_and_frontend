class Api::V1::UserController < ApplicationController
  include ApiHelper
  before_filter :validate_auth_token
  respond_to :json

  def add_address

    if params[:street_address].blank? or params[:street_number].blank? or params[:city].blank? or params[:first_name].blank? or params[:last_name].blank?
      render :status=>400,
        :json=>{:message=>"The request must contain complete address information."}
      return   
    end 

    addy = current_user.addresses.find{|e| e.street_address == params[:street_address]}
    
    addy = Address.new if addy.nil?

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

    current_user.first_name = params[:first_name]
    current_user.last_name = params[:last_name]
    current_user.phone_number = params[:phone_number]
    current_user.save(:validate => false)

    addy.user = current_user
    addy.save

    render :json => {:success=>true}

  end
end