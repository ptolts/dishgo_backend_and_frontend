#encoding: utf-8
require 'json'

class Api::V1::OrderController < ApplicationController
  include ApiHelper
  before_filter :validate_auth_token
  respond_to :json

  def submit_order
    order = params["order"]
    order = JSON.parse(order)
    Rails.logger.warn "order:::: #{JSON.pretty_generate(order)}"
    order_object = Order.new
    order_object.billing_address_hash = order["billing_address"]
    order_object.delivery_address_hash = order["delivery_address"]
    order_object.total_cost = order["total_cost"]
    resto = Restaurant.where(:id => order["restaurant_id"]).first
    order_object.restaurant = resto
    order_object.order_items = order["order"]
    order_object.user = current_user
    order_object.confirmed = true
    order_object.save(:validate=>false)
    render :json => {:order_id=>order_object.id.to_s,"test"=>"test"}
    # Rails.logger.warn JSON.pretty_generate(params.to_json)
  end

  def confirm
    ### ADD CHECK THAT USER OWNS THE ORDERS RESTAURANT.
    order = params["order"]
    order = JSON.parse(order)
    order.confirmed = true
    order.order_confirmed_at = Time.now
    order.save(:validate=>false)
    render :json => {:status => "success"}    
  end

  def status
    order = params["order"]
    order = JSON.parse(order)
    order_object = Order.where(:id => order["order_id"]).first
    render :json => {:confirmed => order_object.confirmed}    
  end

  def fetch_orders
    every_order = Order.all
    render :json => every_order
  end

end