import * as asn1js from "asn1js";
import { getParametersValue } from "pvutils";
import PolicyMapping from "./PolicyMapping";
//**************************************************************************************
/**
 * Class from RFC5280
 */
export default class PolicyMappings
{
	//**********************************************************************************
	/**
	 * Constructor for PolicyMappings class
	 * @param {Object} [parameters={}]
	 * @property {Object} [schema] asn1js parsed value
	 */
	constructor(parameters = {})
	{
		//region Internal properties of the object
		/**
		 * @type {Array.<PolicyMapping>}
		 * @description mappings
		 */
		this.mappings = getParametersValue(parameters, "mappings", PolicyMappings.defaultValues("mappings"));
		//endregion

		//region If input argument array contains "schema" for this object
		if("schema" in parameters)
			this.fromSchema(parameters.schema);
		//endregion
	}
	//**********************************************************************************
	/**
	 * Return default values for all class members
	 * @param {string} memberName String name for a class member
	 */
	static defaultValues(memberName)
	{
		switch(memberName)
		{
			case "mappings":
				return [];
			default:
				throw new Error(`Invalid member name for PolicyMappings class: ${memberName}`);
		}
	}
	//**********************************************************************************
	/**
	 * Return value of asn1js schema for current class
	 * @param {Object} parameters Input parameters for the schema
	 * @returns {Object} asn1js schema object
	 */
	static schema(parameters = {})
	{
		// PolicyMappings OID ::= 2.5.29.33
		//
		//PolicyMappings ::= SEQUENCE SIZE (1..MAX) OF PolicyMapping

		/**
		 * @type {Object}
		 * @property {string} [blockName]
		 * @property {string} [utcTimeName] Name for "utcTimeName" choice
		 * @property {string} [generalTimeName] Name for "generalTimeName" choice
		 */
		const names = getParametersValue(parameters, "names", {});

		return (new asn1js.Sequence({
			name: (names.blockName || ""),
			value: [
				new asn1js.Repeated({
					name: (names.mappings || ""),
					value: PolicyMapping.schema()
				})
			]
		}));
	}
	//**********************************************************************************
	/**
	 * Convert parsed asn1js object into current class
	 * @param {!Object} schema
	 */
	fromSchema(schema)
	{
		//region Check the schema is valid
		const asn1 = asn1js.compareSchema(schema,
			schema,
			PolicyMappings.schema({
				names: {
					mappings: "mappings"
				}
			})
		);

		if(asn1.verified === false)
			throw new Error("Object's schema was not verified against input data for PolicyMappings");
		//endregion

		//region Get internal properties from parsed schema
		this.mappings = Array.from(asn1.result.mappings, element => new PolicyMapping({ schema: element }));
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convert current object to asn1js object and set correct values
	 * @returns {Object} asn1js object
	 */
	toSchema()
	{
		//region Construct and return new ASN.1 schema for this object
		return (new asn1js.Sequence({
			value: Array.from(this.mappings, element => element.toSchema())
		}));
		//endregion
	}
	//**********************************************************************************
	/**
	 * Convertion for the class to JSON object
	 * @returns {Object}
	 */
	toJSON()
	{
		return {
			mappings: Array.from(this.mappings, element => element.toJSON())
		};
	}
	//**********************************************************************************
}
//**************************************************************************************
